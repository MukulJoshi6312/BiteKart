import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createAndEditShop = async(req, res) => {
    try{
        // Logic to create a shop
        const { name, city, state, address } = req.body;
        let image;
        if(req.file){
            console.log(req.file);
            image = await uploadOnCloudinary(req.file.path);
        }

        let shop = await Shop.findOne({ owner: req.userId });
        if(!shop){
        shop  = await Shop.create({
            name,
            image,
            city,
            state,
            address,
            owner: req.userId,
        });
        } else{
            shop  = await Shop.findByIdAndUpdate(shop._id,{
            name,
            image,
            city,
            state,
            address,
            owner: req.userId,
        }, { new: true });
        }

        await shop.populate("owner items");

        return res.status(201).json({ shop,message: "Shop created successfully" });
    }catch(error){
        console.error("Error creating shop:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const getMyShop = async(req, res) => {
    try{
        const shop = await Shop.findOne({ owner: req.userId }).populate("owner").populate({
            path: "items",
            options: { sort: { updatedAt: -1 } },
        });
        if(!shop){
            return res.status(404).json({ message: "Shop not found" });
        }
        return res.status(200).json({ shop });
    }catch(error){
        console.error("Error fetching shop:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// export const editShop = async(req, res) => {
//     try{
//         const { shopId } = req.params;
//         const { name, city, state, address } = req.body;
//         let image;
//         if(req.file){
//             image = await uploadOnCloudinary(req.file.path);
//         }

//         const shop = await Shop.findById(shopId);
//         if(!shop){
//             return res.status(404).json({ message: "Shop not found" });
//         }

//         if(shop.owner.toString() !== req.userId){
//             return res.status(403).json({ message: "You are not authorized to edit this shop" });
//         }

//         shop.name = name || shop.name;
//         shop.city = city || shop.city;
//         shop.state = state || shop.state;
//         shop.address = address || shop.address;
//         shop.image = image || shop.image;

//         await shop.save();
//         await shop.populate("owner");

//         return res.status(200).json({ shop,message: "Shop updated successfully" });
//     }catch(error){
//         console.error("Error editing shop:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }


export const getShopByCity = async(req, res) => {
    try{
        const { city } = req.params;
        const shops = await Shop.find({ city: { $regex: new RegExp(`^${city}$`, 'i') } }).populate("owner").populate({
            path: "items",
            options: { sort: { updatedAt: -1 } },
        });
        if(!shops || shops.length === 0){
            return res.status(404).json({ message: "No shops found in this city" });
        }
        return res.status(200).json({ shops });
    }catch(error){
        console.error("Error fetching shops by city:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}