//we need this to limit the functionality from the backend e.g. only those authenticated users can
//perform the add new, edit and delete foods/orders functionality who are Admin also
//so this middleware will be used in conjunction with the Auth middleware, cant be used alone

import { UNAUTHORIZED } from "../constants/httpStatus.js";
import authMid from "./auth.mid.js";

const adminMid = (req, res, next) => {
  if (!req.user.isAdmin) res.status(UNAUTHORIZED).send();

  return next();
};

export default [authMid, adminMid];
