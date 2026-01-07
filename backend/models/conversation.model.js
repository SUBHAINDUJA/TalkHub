import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			default: null,
		},
		isGroup: {
			type: Boolean,
			default: false,
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
