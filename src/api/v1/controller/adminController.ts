import { Request, Response, NextFunction } from "express";
import { auth } from "../../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const setUserClaims = async (req: Request, res: Response, next: NextFunction) => {
    const userClaimsToset = req.body

    try {
        await auth.setCustomUserClaims(userClaimsToset.uid, userClaimsToset.claims);
        res.status(HTTP_STATUS.OK).json({ message: "Claims set successfully" });
    } catch (error) {
        next(error);
    }
};