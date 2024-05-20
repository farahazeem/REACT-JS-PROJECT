import React from "react";
import classes from "./button.module.css";

export default function Button({
  type,
  text,
  onClick,
  color,
  backgroundColor,
  fontSize,
  width,
  height,
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

Button.defaultProps = {
  type: "button",
  text: "Submit",
  color: "white",
  backgroundColor: "#e72929",
  fontSize: "1.3rem",
  width: "12rem",
  height: "3.5rem",
};
