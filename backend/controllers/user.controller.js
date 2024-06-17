import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		// need to check if i am logged in or not
		const loggedInUserId = req.user._id;
		// { $ne: loggedInUserId } -->coz we don't want to see ouself in chat
        // .select("-password"); password wali field hide krde
		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};