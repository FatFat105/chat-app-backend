import express, { Request, Response } from "express";
import {json} from "body-parser";
import authRoutes from "./routes/authRoutes";
import conversationsRoutes from "./routes/conversationsRoutes";

const app = express();
app.use(json());

app.use('/auth', authRoutes);
app.use('/conversations', conversationsRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})