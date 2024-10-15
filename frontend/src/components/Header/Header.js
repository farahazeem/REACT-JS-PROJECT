import React, { useRef } from "react";
import classes from "./header.module.css";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LocalShipping } from "@mui/icons-material";
import { OverlayPanel } from "primereact/overlaypanel";
import { VirtualScroller } from "primereact/virtualscroller";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const overlayPanelRef = useRef(null);
  const items = Array.from({ length: 100000 }).map((_, i) => ({
    label: `Someone liked Food item #${i}`,
    value: i,
  }));

  const handleIconClick = (event) => {
    overlayPanelRef.current.toggle(event);
  };

  const itemTemplate = (item) => {
    return <div className="p-2">{item.label}</div>;
  };

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
          Scrumptious..
        </Link>
        <nav>
          <ul>
            <li className="flex">
              <button
                onClick={handleIconClick}
                style={{
                  cursor: "pointer",
                  color: "#0370b9",
                }}
              >
                <NotificationsNoneIcon />
              </button>
              <OverlayPanel ref={overlayPanelRef} style={{ width: "300px" }}>
                <VirtualScroller
                  items={items}
                  itemSize={38}
                  itemTemplate={itemTemplate}
                  lazy
                  data-testid="notifications-panel"
                  className={classes.hide_scrollbar}
                  style={{ height: "300px" }} // Height to constrain the VirtualScroller
                  onScrollIndexChange={(e) => console.log(e.first)} // For lazy loading
                />
              </OverlayPanel>
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
