import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export const sendMessage=async (req,res)=>{
    try {
		const { message } = req.body;
        // In Express.js, the req.params object contains route parameters, which are part of the URL path. 
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

        //laad previous conversation
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

        // if conversation is for the first time
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}
        
        res.status(201).json(newMessage);

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// // SOCKET IO FUNCTIONALITY WILL GO HERE
		// const receiverSocketId = getReceiverSocketId(receiverId);
		// if (receiverSocketId) {
		// 	// io.to(<socket_id>).emit() used to send events to specific client
		// 	io.to(receiverSocketId).emit("newMessage", newMessage);
		// }

		// res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}
export const getMessages=async (req,res)=>{
    try{
		// user ki id;
        const { id: userToChatId } = req.params;
		// meri id;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
    } catch (error) {
		console.log("Error in getMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}