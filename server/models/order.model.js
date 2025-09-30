import mongoose from "mongoose";

const shopOrderItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    name: { type: String },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
  },
  { timestamps: true }
);

const shopOrderSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subTotal: { type: Number },
    shopOrderItems: [shopOrderItemSchema],
    status: {
      type: String,
      enum: ["PENDING", "PREPARING", "OUT FOR DELIVERY", "DELIVERED"],
      default: "PENDING",
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      default: null,
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveryOtp: {
      type: String,
      default: null,
    },
    otpExpiresIn: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], required: true },
    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: { type: Number },

    shopOrders: [shopOrderSchema],
    payment:{
      type:Boolean,
      default:false
    },
    razorpayOrderId:{
      type:String,
      default:""
    },
    razorpaySecretId:{
      type:String,
       default:""
    },

    razorpayPaymentId:{
      type:String,
       default:""
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
