import { Router } from "express";
import { BAD_REQUEST } from "../constants/httpStatus.js";
import jwt from "jsonwebtoken";
import handler from "express-async-handler";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
const PASSWORD_HASH_SALT_ROUNDS = 10;

const router = Router();

router.post(
  "/login",
  handler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateTokenResponse(user));
      return;
    }

    res.status(BAD_REQUEST).send("Username or password is invalid");
  })
);

router.post(
  "/register",
  handler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      req.status(BAD_REQUEST).send("User already exists, please login!");
      return;
    }

    const encryptedPassword = await bcrypt.hash(
      password,
      PASSWORD_HASH_SALT_ROUNDS
    );

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
    };

    const result = await UserModel.create(newUser);
    res.send(generateTokenResponse(result));
  })
);

const generateTokenResponse = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      emial: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET, //secret or private key hence its value is defind in .env file
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user.id,
    emial: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token,
  };
};

export default router;
