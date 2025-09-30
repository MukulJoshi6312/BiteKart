import User from "../models/user.model.js";

export const currentUser = async(req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(404).json({ message: "UserId is not found" });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching current user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateUserLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.userId;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "location.coordinates": [longitude, latitude],
        },
      },
      { new: true, runValidators: true } // new:true => updated doc return karega
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Location updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
