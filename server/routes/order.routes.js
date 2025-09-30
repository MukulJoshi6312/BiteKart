import express from 'express'
import isAuth from '../middlewares/isAuth.js';
import { acceptOrder, getCurrentOrderForDeliveryBoy, getDeliveryBoyAssignment, getMyOrders, getOrderById, getTodayDeliveries, placeOrder, sendDeliveryOtp, updateOrderStatus, verifyDeliveryOtp, verifyPayment } from '../controllers/order.controller.js';

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.get("/my-orders", isAuth, getMyOrders);
orderRouter.post("/update-order-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRouter.get("/get-assignment", isAuth, getDeliveryBoyAssignment);
orderRouter.get("/accept-order/:assignmentId", isAuth, acceptOrder);
orderRouter.get("/get-current-order", isAuth, getCurrentOrderForDeliveryBoy);
orderRouter.get("/get-order-by-id/:orderId", isAuth, getOrderById);
orderRouter.post("/send-delivery-otp", isAuth, sendDeliveryOtp);
orderRouter.post("/verify-delivery-otp", isAuth, verifyDeliveryOtp);
orderRouter.post("/verify-payment", isAuth, verifyPayment);
orderRouter.get("/get-today-deliveries", isAuth, getTodayDeliveries);



export default orderRouter;