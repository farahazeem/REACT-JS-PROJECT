import React from "react";
import classes from "./button.module.css";

export default function Button({
  type = "button",
  text = "Submit",
  onClick,
  color = "white",
  backgroundColor = "#e72929",
  fontSize = "1.3rem",
  width = "12rem",
  height = "3.5rem",
}) {
  return (
    <div className={classes.container}>
      <button
        style={{
          color,
          backgroundColor,
          width,
          height,
          fontSize,
        }}
        type={type}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}
