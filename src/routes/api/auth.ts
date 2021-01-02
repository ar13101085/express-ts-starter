import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { IUser } from "../../models/schema-model/User";
import { GeneralError, NotFound } from "../../utils/errors";
import { DefaultPayloadModel } from "../../models/DefaultPayload";
import auth from "../../middleware/auth";

const router: Router = Router();

// @route   GET api/auth
// @desc    Get authenticated user given the token
// @access  Private
router.get("/", auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: IUser = await User.findById(req.userId).select("-password");
    if (!user) {
      throw new NotFound("No login user found.");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// @route   POST api/auth
// @desc    Login user and get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Email is required").exists(),
    check("password", "Password is required").exists()
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response: DefaultPayloadModel<string> = {
        isSuccess: false,
        msg: "BAD REQUEST",
        data: errors.array().join(",")
      }
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json(response);
    }

    const { email, password } = req.body;
    try {
      let user: IUser = await User.findOne({ email });


      if (!user) {
        throw new NotFound("Email or password is invalid");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new GeneralError("Email or password is invalid");
      }

      const payload: Payload = {
        userId: user.id
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: config.get("jwtExpiration") },
        (err, token) => {
          if (err) throw err;

          let response: DefaultPayloadModel<any> = {
            isSuccess: true,
            msg: "Successfully generate token",
            data: token
          }
          res.json(response);
        }
      );
    } catch (err) {
      next(err);
    }
  }
);



export default router;
