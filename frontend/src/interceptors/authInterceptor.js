import axios from "axios";

//we are creating this interceptor for the auth of the checkout page
axios.interceptors.request.use(
  (req) => {
    const user = localStorage.getItem("user");
    const token = user && JSON.parse(user).token;
    if (token) {
      //dats y the name of the token ('access_token' here) should exactly be the same as we defined in auth.mid.js
      req.headers["access_token"] = token;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);
