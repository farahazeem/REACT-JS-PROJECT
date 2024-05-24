import React, { useEffect } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useLoading } from "../../hooks/useLoading";
import { pay } from "../../services/orderService";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//this component will get the order from the payment page and pass it to the Buttons component
export default function PaypalButtons({ order }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "Aa93V2LnLOoJB4_pYlTp1VbEe_DNU5nOCKPTSmixptVEUKSxoewT5BqMgE24ZdvdjG29ybAyHDRy9QwB",
      }}
    >
      <Buttons order={order} />
    </PayPalScriptProvider>
  );
}

function Buttons({ order }) {
  const [{ isPending }] = usePayPalScriptReducer();
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    isPending ? showLoading() : hideLoading();
  });
  const { clearCart } = useCart();
  const navigate = useNavigate();

  //all three methods we want to pass to the builtin payPal component

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: order.totalPrice,
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const payment = await actions.order.capture();
      const orderId = await pay(payment.id);
      clearCart();
      toast.success("Payment Saved Successfully", "Success");
      navigate("/track/" + orderId);
    } catch (error) {
      toast.error("Payment Saved Failed", "Error");
    }
  };

  const onError = (err) => {
    toast.error("Payment Failed", "Error");
  };

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onError}
    />
  );
}
