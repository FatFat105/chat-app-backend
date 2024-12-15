import express, { Request, Response } from "express";
import {json} from "body-parser";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})