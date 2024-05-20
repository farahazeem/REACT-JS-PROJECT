import React from "react";
import classes from "./input.module.css";
import InputContainer from "../InputContainer/InputContainer";

function Input(
  { label, type, defaultValue, onChange, onBlur, name, error, placeholder },
  ref
) {
  const getErrorMessage = () => {
    if (!error) return;
    if (error.message) return error.message;

    switch (error.type) {
      case "required":
        return "This field is required";
      case "minLength":
        return "Field is too short";
      default:
        return "*";
    }
  };
  return (
    <InputContainer label={label}>
      <input
        defaultValue={defaultValue}
        className={classes.input}
        type={type}
        placeholder={label}
        ref={ref}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <div className={classes.error}>{getErrorMessage()}</div>}
    </InputContainer>
  );
}

export default React.forwardRef(Input);
