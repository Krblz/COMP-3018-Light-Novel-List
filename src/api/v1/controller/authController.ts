import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Email and password are required" });
        return;
    }

    try {
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            }
        );

        const data = await response.json();

        if (data.error) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: "Invalid email or password" });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            idToken: data.idToken,
            email: data.email,
            localId: data.localId,
            expiresIn: data.expiresIn,
            refreshToken: data.refreshToken,
        });
    } catch (error) {
        next(error);
    }
};