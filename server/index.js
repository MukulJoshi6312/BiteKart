import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
dotenv.config();

import http from 'http';
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app)


const io = new Server(server,{
  cors:{
    origin: "https://bitekart-backend.onrender.com", // exact frontend origin
    credentials: true, // allow cookies, authorization headers
    methods:['POST','GET']
  }
})

app.set("io",io);
const PORT = process.env.PORT || 3000;
// database connection 
await connectDB();

// middlewares  
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://bitekart-backend.onrender.com", // exact frontend origin
    credentials: true, // allow cookies, authorization headers
  })
);

// routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// auth routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


