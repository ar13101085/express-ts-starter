import express, { Request, Response } from 'express';
import { signInRouter } from "./signin";
import { signUpRouter } from "./signup";
const router = express.Router();
router.use(signInRouter);
router.use(signUpRouter);

export { router as userRouter };