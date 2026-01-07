import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side

	// group room join/leave
	socket.on('join-group', ({ groupId, userId: u }) => {
		socket.join(groupId);
		io.to(groupId).emit('notification', { type: 'user-joined', groupId, userId: u });
	});

	socket.on('leave-group', ({ groupId, userId: u }) => {
		socket.leave(groupId);
		io.to(groupId).emit('notification', { type: 'user-left', groupId, userId: u });
	});

	// broadcast group messages to room
	socket.on('group-message', (payload) => {
		// payload: { groupId, senderId, text, extra }
		io.to(payload.groupId).emit('group-message', payload);
	});

	// WebRTC signaling relay
	socket.on('webrtc-offer', ({ toSocketId, offer }) => {
		if (toSocketId) io.to(toSocketId).emit('webrtc-offer', { offer, from: socket.id });
	});
	socket.on('webrtc-answer', ({ toSocketId, answer }) => {
		if (toSocketId) io.to(toSocketId).emit('webrtc-answer', { answer, from: socket.id });
	});
	socket.on('webrtc-ice', ({ toSocketId, candidate }) => {
		if (toSocketId) io.to(toSocketId).emit('webrtc-ice', { candidate, from: socket.id });
	});

	// generic notification
	socket.on('notify', ({ toUserId, payload }) => {
		const toSocket = userSocketMap[toUserId];
		if (toSocket) io.to(toSocket).emit('notification', payload);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };
