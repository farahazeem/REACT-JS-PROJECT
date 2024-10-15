import React from "react";
import classes from "./dashboard.module.css";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className={classes.container}>
      <div className={classes.menu}>
        {allItems
          .filter((item) => user.isAdmin || !item.forAdmin)
          .map((item) => (
            <Link
              key={item.title}
              to={item.url}
              style={{
                backgroundColor: item.bgColor,
                color: item.color,
              }}
            >
              <img src={item.imageUrl} alt={item.title} color="white" />
              <h2 style={{ color: "white" }}>{item.title}</h2>
            </Link>
          ))}
      </div>
    </div>
  );
}

const allItems = [
  {
    title: "Orders",
    imageUrl: "/icons/orders.svg",
    url: "/orders",
    bgColor: "#0370b9",
    color: "white",
  },
  {
    title: "Profile",
    imageUrl: "/icons/profile.svg",
    url: "/profile",
    bgColor: "#0370b9",
    color: "white",
  },
  {
    title: "Users",
    imageUrl: "/icons/users.svg",
    url: "/admin/users",
    forAdmin: true,
    bgColor: "#0370b9",
    color: "white",
  },
  {
    title: "Foods",
    imageUrl: "/icons/foods.svg",
    url: "/admin/foods",
    forAdmin: true,
    bgColor: "#0370b9",
    color: "white",
  },
];
