import React from "react";
import classes from "./header.module.css";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LocalShipping } from "@mui/icons-material";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className={classes.header}>
      <div className="flex justify-between mx-auto my-0">
        {/* transformed the container class to tailwind css

        .container {
            display: flex;
            justify-content: space-between;
            margin: 0 auto;
        } */}
        <Link to={"/"} className={classes.logo}>
          Food Mine!
        </Link>
        <nav>
          <ul>
            <li className="flex">
              <a>
                <NotificationsNoneIcon />
              </a>
            </li>
            {user ? (
              <li className={classes.menu_container}>
                <Link to="/dashboard">{user.name}</Link>
                <div className={classes.menu}>
                  <Link to="/profile">
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    Profile
                  </Link>
                  <Link to="/orders">
                    <LocalShipping sx={{ mr: 1 }} />
                    Orders
                  </Link>
                  <a onClick={logout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Log out
                  </a>
                </div>
              </li>
            ) : (
              <Link to="/login">Login</Link>
            )}
            <li>
              <Link to="/cart">
                Cart
                {cart.totalCount > 0 && (
                  <span className={classes.cart_count}>{cart.totalCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
