import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import pool from "../models/db";
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'swafasecretkey';

export const register = async (req: Request, res: Response) => {
    // 1. get username, email and password
    // 2. insert those data into our db
    // 3. return message, user information
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        const user = result.rows[0];
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register' });
    }
}

export const login = async (req: Request, res: Response): Promise<any> => {
    // 1. get email and password
    // 2. verify if the email exists
    // 3. compare password -> 'invalid credentials'
    // 4. return token
    const { email, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        const user = result.rows[0];
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });

        let finalResult = {...user, token}
        res.json({ user: finalResult });

    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
}