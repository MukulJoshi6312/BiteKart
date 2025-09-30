import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    // Your order placement logic here
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(400).json({ error: "Invalid delivery address" });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop._id;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(400).json({ error: "Shop not found" });
        }
        const items = groupItemsByShop[shopId];
        const subTotal = items.reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
          })),
        };
      })
    );

    if (paymentMethod === "ONLINE") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });

      return res.status(200).json({
        razorOrder,
        orderId: newOrder._id,
      });
    }

    // Create and save the order
    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });
    await newOrder.save();

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await newOrder.populate("shopOrders.shop", "name");
    await newOrder.populate("shopOrders.owner", "name socketId");
    await newOrder.populate("user", "name email mobile");

    const io = req.app.get("io");
    if (io) {
      newOrder.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: newOrder._id,
            paymentMethod: newOrder.paymentMethod,
            user: newOrder.user,
            shopOrders: shopOrder,
            createdAt: newOrder.createdAt,
            deliveryAddress: newOrder.deliveryAddress,
            payment: newOrder.payment,
          });
        }
      });
    }

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;
    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status !== "captured") {
      return res.status(400).json({
        message: "Payment not captured",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({
        message: "Order not found",
      });
    }
    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await order.populate("shopOrders.shopOrderItems.item", "name image price");
    await order.populate("shopOrders.shop", "name");
    await order.populate("shopOrders.owner", "name socketId");
    await order.populate("user", "name email mobile");

    const io = req.app.get("io");
    if (io) {
      order.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            shopOrders: shopOrder,
            createdAt: order.createdAt,
            deliveryAddress: order.deliveryAddress,
            payment: order.payment,
          });
        }
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.log("Error while verifying the payment");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "fullName email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("user");
      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: "No orders found" });
      }
      res.status(200).json(orders);
    } else if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName email mobile");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find(
          (so) => so.owner.toString() === req.userId
        ),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        payment: order.payment,
      }));

      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: "No orders found" });
      }
      res.status(200).json(filteredOrders);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (so) => so.shop.toString() === shopId
    );
    if (!shopOrder) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this order" });
    }
    shopOrder.status = status;
    let deliveryBoysPayload = [];
    if (status === "OUT FOR DELIVERY" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearbyDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 5000, // 5 km radius
          },
        },
      }); // Limit to 5 nearest delivery boys
      const nearByIds = nearbyDeliveryBoys.map((db) => db._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["BROADCASTED", "COMPLETED"] },
      }).distinct("assignedTo");

      const busyIdsSet = new Set(busyIds.map((id) => id.toString()));
      const availableDeliveryBoys = nearbyDeliveryBoys.filter(
        (db) => !busyIdsSet.has(db._id.toString())
      );
      const candidates = availableDeliveryBoys.map((db) => db._id);

      if (candidates.length === 0) {
        await order.save();
        return res.status(200).json({
          message:
            "order status updated but there is no available delivery personnel",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadcastedTo: candidates,
        status: "BROADCASTED",
      });
      // await deliveryAssignment.save();
      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;

      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((db) => ({
        _id: db._id,
        fullName: db.fullName,
        email: db.email,
        mobile: db.mobile,
        location: db.location,
        longitude: db.location.coordinates[0],
        latitude: db.location.coordinates[1],
      }));

      await deliveryAssignment.populate("order");
      await deliveryAssignment.populate("shop");

      const io = req.app.get("io");
      if (io) {
        availableDeliveryBoys.forEach((boy) => {
          const boySocketId = boy.socketId;
          if (boySocketId) {
            io.to(boySocketId).emit("newAssignment", {
              sentTo: boy._id,
              assignmentId: deliveryAssignment._id,
              orderId: deliveryAssignment.order._id,
              shopName: deliveryAssignment.shop.name,
              deliveryAddress: deliveryAssignment.order.deliveryAddress,
              items:
                deliveryAssignment.order.shopOrders.find(
                  (so) =>
                    so._id.toString() ===
                    deliveryAssignment.shopOrderId.toString()
                )?.shopOrderItems || [],
              subTotal: deliveryAssignment.order.shopOrders.find(
                (so) =>
                  so._id.toString() ===
                  deliveryAssignment.shopOrderId.toString()
              )?.subTotal,
            });
          }
        });
      }
    }

    const updatedShopOrder = order.shopOrders.find(
      (so) => so.shop.toString() === shopId
    );
    await shopOrder.save();
    await order.save();
    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile"
    );
    await order.populate("user", "socketId");

    const io = req.app.get("io");
    if (io) {
      const userSocketId = order.user.socketId;

      if (userSocketId) {
        io.to(userSocketId).emit("updateStatus", {
          orderId: order._id,
          shopId: updatedShopOrder.shop._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    // Notify the delivery

    res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignment = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "BROADCASTED",
    })
      .populate("order")
      .populate("shop");

    const formated = assignment.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find(
          (so) => so._id.toString() === a.shopOrderId.toString()
        )?.shopOrderItems || [],
      subTotal: a.order.shopOrders.find(
        (so) => so._id.toString() === a.shopOrderId.toString()
      )?.subTotal,
    }));

    res.status(200).json(formated);
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.status !== "BROADCASTED") {
      return res.status(400).json({ message: "Assignment is expired" });
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["BROADCASTED", "COMPLETED"] },
    });

    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "You are already assigned to another order" });
    }

    assignment.assignedTo = req.userId;
    assignment.acceptedAt = new Date();
    assignment.status = "ASSIGNED";
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const shopOrder = order.shopOrders.id(assignment.shopOrderId);
    shopOrder.assignedDeliveryBoy = req.userId;
    await order.save();
    await order.populate("shopOrders.assignedDeliveryBoy");

    res
      .status(200)
      .json({ message: "Assignment accepted successfully", order, shopOrder });
  } catch (error) {
    console.error("Error accepting assignment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentOrderForDeliveryBoy = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: "ASSIGNED",
    })
      .populate("shop")
      .populate("assignedTo", "fullName email mobile location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullName email mobile location" }],
      });

    if (!assignment) {
      return res.status(404).json({ message: "No current assignment found" });
    }
    if (!assignment.order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = assignment.order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString()
    );
    if (!shopOrder) {
      return res.status(404).json({ message: "Shop order not found" });
    }
    let deliveryBoyLocation = { lat: null, lng: null };
    if (assignment.assignedTo?.location?.coordinates.length === 2) {
      deliveryBoyLocation.lat =
        assignment.assignedTo?.location?.coordinates[1] || null;
      deliveryBoyLocation.lng =
        assignment.assignedTo?.location?.coordinates[0] || null;
    }

    let customerLocation = { lat: null, lng: null };
    if (assignment.order?.deliveryAddress) {
      customerLocation.lat =
        assignment.order?.deliveryAddress?.latitude || null;
      customerLocation.lng =
        assignment.order?.deliveryAddress?.longitude || null;
    }
    res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
      shop: assignment.shop,
    });
  } catch (error) {
    console.error("Error fetching current assignment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Additional functions related to order management can be added here

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrders.assignedDeliveryBoy",
        model: "User",
      })
      .populate({
        path: "shopOrders.shopOrderItems.item",
        model: "Item",
      })
      .lean();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;
    const order = await Order.findById(orderId).populate("user");

    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!order || !shopOrder) {
      return res.status(400).json({
        message: "enter valid order/shopOrderId",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpiresIn = Date.now() + 5 * 60 * 1000;
    await order.save();
    await sendDeliveryOtpMail(order.user, otp);
    return res.status(200).json({
      message: `OTP send Successfully to ${order?.user?.fullName}`,
    });
  } catch (error) {
    console.error("Error sending delivery OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;
    const order = await Order.findById(orderId);
    const shopOrder = await order.shopOrders.id(shopOrderId);
    if (!order || !shopOrder) {
      return res.status(404).json({ message: "Order or Shop Order not found" });
    }

    if (
      shopOrder.deliveryOtp !== otp ||
      !shopOrder.otpExpiresIn ||
      shopOrder.otpExpiresIn < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid/Expired OTP" });
    }

    shopOrder.status = "DELIVERED";
    shopOrder.deliveredAt = Date.now();
    await order.save();
    await DeliveryAssignment.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo: shopOrder.assignedDeliveryBoy,
    });

    return res.status(200).json({
      message: "OTP verified successfully, Order DELIVERED Successfully",
    });
  } catch (error) {
    console.error("Error verifying delivery OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTodayDeliveries = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": deliveryBoyId,
      "shopOrders.status": "DELIVERED",
      "shopOrders.deliveredAt": { $gte: startOfDay },
    }).populate("shopOrders.shop", "name")
      .populate("shopOrders.shopOrderItems.item", "name image price")
      .lean();


    let todaysDeliveries = [];
    orders.forEach(order => {
      order.shopOrders.forEach(shopOrder => {
        console.log(shopOrder)
        if (
          shopOrder?.assignedDeliveryBoy.toString() === deliveryBoyId.toString() &&
          shopOrder?.status === "DELIVERED" &&
          shopOrder?.deliveredAt &&
          shopOrder?.deliveredAt >= startOfDay
        ) {
          todaysDeliveries.push(shopOrder);
        }
      });
    });

    let stats = {};
    todaysDeliveries.forEach(shopOrder=>{
      const hour = new Date(shopOrder.deliveredAt).getHours();
      stats[hour] = (stats[hour] || 0) + 1;
    })
    let formattedStats = Object.keys(stats).map(hour=>({
      hour:parseInt(hour),
      count:stats[hour]
    }))
    // console.log("formatted data ",formattedStats )
    formattedStats.sort((a,b)=>a.hour-b.hour);
    return res.status(200).json(formattedStats)
  } catch (error) {
    console.error("Error today deliveries");
    res.status(500).json({ message: "Internal server error" });
  }
};




// orders:{
//   shop: new ObjectId('68bed801e2491d913e312ba5'),
//   owner: new ObjectId('68b5aa7123ffddc3e181afbf'),
//   subTotal: 498,
//   shopOrderItems: [
//     {
//       item: new ObjectId('68c829fc2dd1af9c1731c9d4'),
//       name: 'Raj Kachori',
//       quantity: 2,
//       price: 249,
//       _id: new ObjectId('68d7ffdf3293771d8f78ddb0'),
//       createdAt: 2025-09-27T15:16:47.620Z,
//       updatedAt: 2025-09-27T15:16:47.620Z
//     }
//   ],
//   status: 'DELIVERED',
//   assignment: new ObjectId('68d803c9d65f9e157951772c'),
//   assignedDeliveryBoy: new ObjectId('68ca4e6b2ccb0494653764c1'),
//   deliveryOtp: '3473',
//   otpExpiresIn: 2025-09-28T03:44:10.251Z,
//   deliveredAt: 2025-09-28T03:40:43.721Z,
//   _id: new ObjectId('68d7ffdf3293771d8f78ddaf'),
//   createdAt: 2025-09-27T15:16:47.621Z,
//   updatedAt: 2025-09-28T03:40:43.722Z
// }




