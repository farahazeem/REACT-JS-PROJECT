import { connect, set } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { sample_foods, sample_users } from "../data.js";
import bcrypt from "bcryptjs";
import { FoodModel } from "../models/food.model.js";

const PASSWORD_HASH_SALT_ROUNDS = 10;

set("strictQuery", true); // Ensures all data going to the database strictly follows the schemas we have defined

export const dbconnect = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await seedUsers(); // After connecting to the database, we're seeding the users
    await seedFoods();
    console.log("Connected successfully---");
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log("Users seed is already done!");
    return;
  }

  // Adding/seeding all the users in the database with hashed passwords
  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserModel.create(user);
  }

  console.log("Users seed is done!");
}

async function seedFoods() {
  const foods = await FoodModel.countDocuments();
  if (foods > 0) {
    console.log("Foods seed is already done");
    return;
  }

  for (const food of sample_foods) {
    food.imageUrl = `/foods/${food.imageUrl}`;
    await FoodModel.create(food);
  }
  console.log("Foods seed is done");
}
