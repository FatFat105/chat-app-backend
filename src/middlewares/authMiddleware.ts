import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    // bearer my_valid_token

    if(!token) {
        res.status(403).json({error: 'No token provided'});
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN || 'swafasecretkey');
        req.user = decoded as {id: string};
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'})
    }
}