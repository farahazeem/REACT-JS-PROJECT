//we need this middleware to limit the access of the orderRouter(i.e. order.router.js) only to the authenticated users

//import { verify } from "jsonwebtoken";
import pkg from "jsonwebtoken";
import { UNAUTHORIZED } from "../constants/httpStatus.js";
const { verify } = pkg;
//this middleware function has an additional input called next which is used to call the next
//item in the pipeline (which will be the api call in our case) => (in other words, after finishing the middleware
//you always need to call the next function
export default (req, res, next) => {
  const token = req.headers.access_token;
  if (!token) return res.status(UNAUTHORIZED).send();

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    res.status(UNAUTHORIZED).send();
  }

  return next();
};
