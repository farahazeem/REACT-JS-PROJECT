import express from "express";
import cors from "cors";
import foodRouter from "./routers/food.router.js";
import userRouter from "./routers/user.router.js";
import orderRouter from "./routers/order.router.js";
import dotenv from "dotenv";
import { dbconnect } from "./config/database.config.js";
dotenv.config();
dbconnect();

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

//add all the routers we created in the app here
app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
