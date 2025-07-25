const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  const { user1, user2 } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.saveMessage = async (req, res) => {
  const { sender, recipient, text } = req.body;
  try {
    const message = new Message({ sender, recipient, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};
