import { Router } from "express";
import handler from "express-async-handler";
import { BAD_REQUEST, UNAUTHORIZED } from "../constants/httpStatus.js";
import { OrderModel } from "../models/order.model.js";
import { OrderStatus } from "../constants/orderStatus.js";
import auth from "../middleware/auth.mid.js";
import { UserModel } from "../models/user.model.js";

const router = Router();
router.use(auth);

router.post(
  "/create",
  handler(async (req, res) => {
    const order = req.body;

    if (order.items.length <= 0) res.status(BAD_REQUEST).send("Cart is Empty");

    //find and delete the order
    await OrderModel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({ ...order, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
  })
);

router.put(
  "/pay",
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(BAD_REQUEST).send("Order Not Found!");
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    res.send(order._id);
  })
);

router.get(
  "/track/:orderId",
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const filter = {
      _id: orderId,
    };

    if (!user.isAdmin) {
      filter.user = user._id;
    }

    //if user is not admin, show only the specific order to the user
    const order = await OrderModel.findOne(filter);
    if (!order) return res.send(UNAUTHORIZED);
    return res.send(order);
  })
);

//api to get the latest order of the currently logged in user
router.get(
  "/newOrderForCurrentUser",
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);

    if (order) res.send(order);
    else res.send(BAD_REQUEST).send();
  })
);

//this api call is the simplest as it simply returning all the props of ObjectStatus we defined in frontend using javaScript Object.Values function
//thats y we didnt used any handler or complex logic
router.get("/allstatus", (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

//it will get specific orders if the status is there otherwise will load all the orders
//its neseccary to put this api at the end of order router otherwise it will take any param as the status
//and all the apis below it will be unreachable
router.get(
  "/:status?",
  handler(async (req, res) => {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);
    const filter = {};

    if (!user.isAdmin) filter.user = user._id; //if logged in user is not admin only then this filter will work to show only the orders associated with this user
    if (status) filter.status = status; //if any status is coming from the url then this filter will have that status

    const orders = await OrderModel.find(filter).sort("-createdAt"); //-createdAt is for getting the orders newly created first
    res.send(orders);
  })
);

const getNewOrderForCurrentUser = async (req) =>
  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate("user");

export default router;
