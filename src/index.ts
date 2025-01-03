import express, { Request, Response } from "express";
import { json } from "body-parser";
import authRoutes from "./routes/authRoutes";
import conversationsRoutes from "./routes/conversationsRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import http from "http";
import { Server } from "socket.io";
import { saveMessage } from "./controllers/messagesController";

const app = express();
const server = http.createServer(app);
app.use(json());
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use('/auth', authRoutes);
app.use('/conversations', conversationsRoutes);
app.use('/messages', messagesRoutes);

io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);

    socket.on('joinConversation', (conversationId) => {
        // an event was received from the client
        socket.join(conversationId);
        console.log('User joined conversation: ', conversationId);
    });

    socket.on('sendMessage', async (message) => {
        const { conversationId, senderId, content } = message

        try {
            const savedMessage =  await saveMessage(conversationId, senderId, content);
            console.log("sendMessage: ");
            console.log(savedMessage);
            io.to(conversationId).emit('newMessage', savedMessage);

            io.emit('conversationUpdated', {
                conversationId,
                lastMessage: savedMessage.content,
                lastMessageTime: savedMessage.created_at,
            })
        } catch (error) {
            console.error('Failed to save message: ', error);
        }
    });

    // upon disconnection
    socket.on("disconnect", (reason) => {
        console.log(`Disconnected due to ${reason}`);
        console.log('User disconnected: ', socket.id);
    });
});

io.listen(3000);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})