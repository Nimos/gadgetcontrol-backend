import { Request, Response } from "express";
import authController from "../controllers/authController";

export function verifyToken(req: Request, res: Response, next: Function) {
    const token: string = (req as any).token;
    if (!token) {
        return res.json({ "error": true, "message": "NOT_LOGGED_IN" });
    }

    try {
        if (!authController.verify(token)) {
            return res.json({ "error": true, "message": "EXPIRED_TOKEN" });
        }
    } catch (e) {
        return res.json({ "error": true, "message": "INVALID_TOKEN" });
    }


    next();
}