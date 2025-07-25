const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIo = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', (data) => {
    // Send to both sender and recipient if they are connected
    io.emit('receiveMessage', data); // TODO: Replace with targeted emit if user-socket mapping is implemented
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
