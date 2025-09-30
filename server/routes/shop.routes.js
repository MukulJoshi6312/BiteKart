import express from 'express'
import { createAndEditShop, getMyShop, getShopByCity } from '../controllers/shop.controller.js';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';

const shopRouter = express.Router();

shopRouter.post("/create-edit-shop", isAuth, upload.single("image"), createAndEditShop);
shopRouter.get("/get-my-shop", isAuth, getMyShop);
shopRouter.get("/get-shop-by-city/:city", isAuth, getShopByCity);

export default shopRouter;