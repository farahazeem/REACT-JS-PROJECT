import axios from "axios";

export const createOrder = async (order) => {
  try {
    const data = axios.post("/api/orders/create", order);
    return data;
  } catch (error) {}
};

export const getOrderForCurrentUser = async () => {
  const { data } = await axios.get("/api/orders/newOrderForCurrentUser");
  return data;
};

export const pay = async (paymentId) => {
  const { data } = await axios.put("/api/orders/pay", { paymentId });
  return data;
};
