import express, { Router } from "express";
import { signIn } from "../controller/authController";

const router: Router = express.Router();

router.post("/auth/signIn", signIn);

export default router;