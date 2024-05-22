import React, { useState } from "react";
import classes from "./checkoutPage.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import Title from "../../components/Title/Title";
import { useForm } from "react-hook-form";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import Price from "../../components/Price/Price";
import Map from "../../components/Map/Map";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../../services/orderService";
import OrderItemsList from "../../components/OrderItemsList/OrderItemsList";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, totalPrice, totalCount } = useCart();
  const navigate = useNavigate();
  const [order, setOrder] = useState({ ...cart, addressLatLng: null });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    console.log("order is", order, order.address);
    console.log("data is", data);
    if (!order.address) {
      toast.warning("Please select your location on the map");
      return;
    }

    const { lat, lng } = order.address;
    console.log("Latitude is", lat);
    console.log("Longitude is", lng);

    await createOrder({ ...order, name: data.name, address: data.address });
    navigate("/payment");
  };

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className={classes.details}>
          <div className={classes.order}>
            <div className={classes.order_details}>
              <Title title="Order Form" fontSize="1.6rem" />
              <Input
                defaultValue={user.name}
                label="Name"
                {...register("name")}
                error={errors.name}
              />
              <Input
                type="address"
                defaultValue={user.address}
                label="Address"
                {...register("address")}
                error={errors.address}
              />
            </div>
            <div className={classes.order_items}>
              <OrderItemsList order={order} />
            </div>
          </div>
          <div className={classes.location}>
            <Title title="Choose your location" fontSize="1.6rem" />
            <Map
              location={order.addressLatLng}
              onChange={(latlng) => {
                console.log({ latlng });
                setOrder({ ...order, address: latlng });
              }}
            />
          </div>
        </div>
        <div className={classes.button_container}>
          <Button
            type="submit"
            text="Go To Payment"
            width="20%"
            height="3rem"
          ></Button>
        </div>
      </form>
    </div>
  );
}
