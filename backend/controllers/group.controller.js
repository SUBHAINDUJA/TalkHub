import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

export const createGroup = async (req, res) => {
  try {
    const { name, members = [], creator } = req.body;
    const conv = await Conversation.create({ name, participants: members, isGroup: true, creator });
    res.json(conv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const conv = await Conversation.findByIdAndUpdate(groupId, { $addToSet: { participants: userId } }, { new: true });
    res.json(conv);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const conv = await Conversation.findByIdAndUpdate(groupId, { $pull: { participants: userId } }, { new: true });
    res.json(conv);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const postGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { senderId, text } = req.body;
    const msg = await Message.create({ senderId, message: text, conversationId: groupId });
    // push to conversation
    await Conversation.findByIdAndUpdate(groupId, { $push: { messages: msg._id } });
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
