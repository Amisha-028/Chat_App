import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
            // this should be from user model
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt => message.createdAt : 15:30
	},
    // moongoose will automatically tell us when it is created or updated
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;