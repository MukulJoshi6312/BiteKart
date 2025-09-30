import express from 'express'
import isAuth from '../middlewares/isAuth.js';
import { addItem, deleteItem, editItem, getItemById, getItemByShop, getItemsByCity, rating, searchItems } from '../controllers/item.controller.js';
import { upload } from '../middlewares/multer.js';

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/get-item/:itemId", isAuth, getItemById);
itemRouter.delete("/delete-item/:itemId", isAuth, deleteItem);
itemRouter.get("/get-items-by-city/:city", isAuth, getItemsByCity);
itemRouter.get("/get-items-by-shop/:shopId", isAuth, getItemByShop);
itemRouter.get("/search-items", isAuth, searchItems);
itemRouter.post("/rating", isAuth, rating);

export default itemRouter;