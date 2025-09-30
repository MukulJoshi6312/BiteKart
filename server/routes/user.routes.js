import express from 'express'
import { currentUser, updateUserLocation } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';

const userRouter = express.Router();   
userRouter.get("/current", isAuth, currentUser);
userRouter.post("/update-location", isAuth, updateUserLocation);

export default userRouter; 