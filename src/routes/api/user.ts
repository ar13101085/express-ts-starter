import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator/check";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";

import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { IUser } from "../../models/schema-model/User";
import { GeneralError } from "../../utils/errors";
import { DefaultPayloadModel } from "../../models/DefaultPayload";

const router: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new GeneralError(errors.array().join(","));
      }

      const { email, password } = req.body;
      try {
        let user: IUser = await User.findOne({ email });

        if (user) {
          throw new GeneralError( "User already exists");
        }

        const options: gravatar.Options = {
          s: "200",
          r: "pg",
          d: "mm"
        };


        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        // Build user object based on IUser
        const userFields = {
          email,
          password: hashed
        };

        user = new User(userFields);

        await user.save();

        const payload: Payload = {
          userId: user.id
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: config.get("jwtExpiration") },
          (err, token) => {
            if (err) throw err;

            let response: DefaultPayloadModel<string> = {
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
    } catch (error) {
      next(error);
    }

  }
);

export default router;
