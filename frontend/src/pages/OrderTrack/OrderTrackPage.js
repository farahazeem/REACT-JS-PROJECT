import React, { useEffect, useState } from "react";
import classes from "./orderTrackPage.module.css";
import { Link, useParams } from "react-router-dom";
import { trackOrderById } from "../../services/orderService";
import NotFound from "../../components/NotFound/NotFound";
import Title from "../../components/Title/Title";
import OrderItemsList from "../../components/OrderItemsList/OrderItemsList";
import Map from "../../components/Map/Map";
import DateTime from "../../components/DateTime/DateTime";

export default function OrderTrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();

  useEffect(() => {
    orderId && trackOrderById(orderId).then((data) => setOrder(data));
  }, []);

  if (!orderId)
    <NotFound message="Order Not Found" linkText="Go To Home Page" />;

  return (
    order && (
      <div className={classes.container}>
        <div className={classes.content}>
          <Title title={`Order #${order.id}`} fontSize="1.6rem" />
          <div className={classes.summary}>
            <div>
              <h3>Date:</h3>
              <DateTime date={order.createdAt} />
            </div>
            <div>
              <h3>Name:</h3>
              <span>{order.name}</span>
            </div>
            <div>
              <h3>Address:</h3>
              <span>{order.address}</span>
            </div>
            <div>
              <h3>State:</h3>
              <span>{order.status}</span>
            </div>
            {order.paymentId && (
              <div>
                <h3>Payment Id:</h3>
                <span>{order.paymentId}</span>
              </div>
            )}
          </div>
          <OrderItemsList order={order} />
        </div>
        <div className={classes.map}>
          <Title title="Shipping Address" fontSize="1.6rem" />
          <Map readOnly={true} location={order.addressLatLng} />
        </div>

        {/* show this div if for some reason the order.status is still 'NEW' */}
        {order.status === "NEW" && (
          <div className={classes.payment}>
            <Link to="/payment">Go To Payment</Link>
          </div>
        )}
      </div>
    )
  );
}
