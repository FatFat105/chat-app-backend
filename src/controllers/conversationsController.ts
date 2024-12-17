import pool from "../models/db";
import { Request, Response } from "express";


export const fetchAllConversationsByUserId = async (req: Request, res: Response) => {
    let userId = null;
    if(req.user) {
        userId = req.user.id
    }
    
    try {
        const result = await pool.query(
            `SELECT c.id AS conversation_id, u.username AS participant_name, m.content AS last_message, m.created_at AS last_message_time
            FROM conversations c 
            JOIN users u ON ((u.id = c.participant_one OR u.id = c.participant_two) AND u.id != $1)
            LEFT JOIN LATERAL (
                SELECT content, created_at
                FROM messages
                WHERE conversation_id = c.id
                ORDER BY created_at DESC
                LIMIT 1
            ) m ON true
            Where c.participant_one = $1 OR c.participant_two = $1
            ORDER BY m.created_at DESC
            `,
            [userId]
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({error: 'Failed to fetch conversations'});
    }
}