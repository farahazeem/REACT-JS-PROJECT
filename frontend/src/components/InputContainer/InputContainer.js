import React from "react";
import classes from "./inputContainer.module.css";

export default function InputContainer({ label, id, bgColor, children }) {
  return (
    <div className={classes.container} style={{ backgroundColor: bgColor }}>
      <label htmlFor={id} className={classes.label}>
        {label}
      </label>
      <div className={classes.content}>{children}</div>
    </div>
  );
}
