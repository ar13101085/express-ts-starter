import express, { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator/check';
import User, { IUser } from '../../../models/User';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { DefaultPayloadModel } from 'src/types/default-payload';
import { GeneralError } from '../../../utils/errors';
const router = express.Router();
router.post("/signup",
    [
        check("userName", "Please include a valid email").isLength({ min: 0 }),
        check(
            "password",
            "Please enter a password with 6 or more characters"
        ).isLength({ min: 6 })
    ], async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new GeneralError("invalid input.please check your data.");
            }

            const { userName, password } = req.body;

            let user: IUser | null = await User.findOne({ userName });

            if (user) {
                throw new GeneralError("User already exists");
            }
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            // Build user object based on IUser
            const userFields = { userName, password: hashed }

            user = new User(userFields);

            await user.save();

            const payload: any = {
                userId: user.id
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET_KEY || "",
                { expiresIn: "7d" },
                (err, token) => {
                    if (err) throw err;

                    let response: DefaultPayloadModel<string | undefined> = {
                        isSuccess: true,
                        msg: "Successfully create account & generate token",
                        data: token
                    }
                    res.json(response);
                }
            );
        } catch (error) {
            next(error);
        }
    });

export { router as signUpRouter };