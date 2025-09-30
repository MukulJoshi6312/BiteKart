import Item from "../models/item.nodel.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const shop = await Shop.findOne({ owner: req.userId }).populate("items");
    if (!shop) {
      return res
        .status(404)
        .json({ message: "Shop not found. Please create a shop first." });
    }

    // Create new item
    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });
    shop.items.push(item._id);
    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    // await item.populate("category").populate("shop");
    return res.status(201).json({ shop, message: "Item added successfully" });
  } catch (error) {
    console.error("Error adding item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        image,
      },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json({ shop, message: "Item updated successfully" });
  } catch (error) {
    console.error("Error editing item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId).populate("shop");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ item });
  } catch (error) {
    console.error("Error fetching item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Remove item from shop's items array
    shop.items = shop.items.filter((i) => i.toString() !== itemId);
    await shop.save();

    // Delete the item
    await Item.findByIdAndDelete(itemId);

    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json({ shop, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getItemsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    })
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });
    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "No shops found in this city" });
    }
    const shopIds = shops.map((shop) => shop._id);
    const items = await Item.find({ shop: { $in: shopIds } })
      .populate("shop")
      .sort({ updatedAt: -1 });
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No items found in this city" });
    }
    return res.status(200).json(items);
    //  return res.status(200).json({ shops });
  } catch (error) {
    console.error("Error fetching items by city:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getItemByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log("Ye shop id mili hai. ", shopId)
   const shop = await Shop.findById(shopId).populate({
  path: "items",
  populate: {
    path: "shop", // items ke andar shop ko populate karo
    select: "name address owner", // jo fields chahiye wo select kar lo
  },
});
    if (!shop) {
      return res.status(400).json({
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      shop,
      items: shop.items,
    });
  } catch (error) {
    console.error("Error fetching items by shop:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const searchItems = async(req,res)=>{
    try{
        const {query,city} = req.query
        if(!query || !city){
            return null
        }
        const shops = await Shop.find({
            city:{$regex:new RegExp(`^${city}$`,"i")}
        }).populate('items')
        if(!shops){
            return res.status(400).json({message:"Shops not found"})
        }

        const shopIds = shops.map(s=>s._id);
        const items = await Item.find({
            shop:{$in:shopIds},
            $or:[
                {name:{$regex:query,$options:"i"}},
                {category:{$regex:query,$options:"i"}}
            ]
        }).populate("shop","name image");

        return res.status(200).json(items)


    }catch(error){
    console.error("Error fetching items by search query:", error);
    return res.status(500).json({ message: "Internal server error" });
    }
}

export const rating  = async(req,res)=>{
  try{
    const {itemId,rating} = req.body;
    if(!itemId || !rating){
      return res.status(400).json({
        message:"ItemId and rating is required"
      })
    }
    if(rating < 1 || rating > 5){
      return res.status(400).json({
        message:"Rating must be between i to 5"
      })
    }

    const item = await Item.findById(itemId);
    if(!item){
      return res.status(400).json({
        message:"Item not found"
      })
    }

    const newCount = item.rating.count + 1;
    const newAverage = (item.rating.average*item.rating.count + rating) / newCount;

    item.rating.count = newCount;
    item.rating.average = newAverage;

    await item.save();
    return res.status(200).json({rating:item.rating});
  }catch(error){
  console.error("Error rating:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}