import express from 'express';
const router = express.Router();
import { userRouter } from "./user";
router.use("/auth", userRouter);
export { router as routes };