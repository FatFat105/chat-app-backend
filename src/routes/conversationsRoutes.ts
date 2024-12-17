import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { fetchAllConversationsByUserId } from "../controllers/conversationsController";

const router = Router();

// conversationsController
router.get('/', verifyToken, fetchAllConversationsByUserId);

export default router;