import { Router } from "express";
import { BAD_REQUEST } from "../constants/httpStatus.js";
import jwt from "jsonwebtoken";
import handler from "express-async-handler";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth.mid.js";
import admin from "../middleware/admin.mid.js";
import axios from "axios";
const PASSWORD_HASH_SALT_ROUNDS = 10;

const router = Router();

router.get(
  "/",
  admin,
  handler(async (req, res) => {
    const users = await UserModel.find({});
    res.send(users);
  })
);

router.get(
  "/getById/:userId",
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, { password: 0 });
    //{ password: 0 } will stop sending the password to the client
    res.send(user);
  })
);

router.put(
  "/update",
  admin,
  handler(async (req, res) => {
    const { id, name, email, address, isAdmin } = req.body;
    await UserModel.findByIdAndUpdate(id, {
      name,
      email,
      address,
      isAdmin,
    });

    res.send();
  })
);

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
    const { name, email, password, address, token } = req.body;
    const user = await UserModel.findOne({ email });
    const isHuman = await verifyRecaptchaToken(token);

    if (!isHuman) {
      return res
        .status(400)
        .send("reCAPTCHA verification failed. Please try again.");
    }

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

//update user profile
//this function will make use of authMiddle ware since this is the function that we only want to
//access by authenticated users, unlike other methods of this router e.g. login and register functions
router.put(
  "/updateProfile",
  auth,
  handler(async (req, res) => {
    const { name, address } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true }
    );

    res.send(generateTokenResponse(user));
  })
);

//change password
router.put(
  "/changePassword",
  auth,
  handler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      res.status(BAD_REQUEST).send("Change Password Failed");
      return;
    }

    const equal = await bcrypt.compare(currentPassword, user.password);
    if (!equal) {
      res.status(BAD_REQUEST).send("Current Password is not correct");
      return;
    }

    user.password = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
    await user.save();
    res.send();
  })
);

router.put(
  "/toggleBlock/:userId",
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;

    if (userId === req.user.id) {
      res.status(BAD_REQUEST).send("Can't block yourself");
      return;
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { isBlocked: !req.user.isBlocked },
      { new: true } //by adding this it returns the updated document
    );

    res.send(user.isBlocked);
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

// Function to verify Google reCAPTCHA token
async function verifyRecaptchaToken(token) {
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`
    );

    if (response.data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
}

export default router;
