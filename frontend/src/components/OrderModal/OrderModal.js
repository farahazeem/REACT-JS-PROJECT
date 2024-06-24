import React, { useState, forwardRef, useImperativeHandle } from "react";
import classes from "./orderModal.module.css";

const OrderModal = (props, ref) => {
  //first param that any functional component would expect will be the props and second can be ref
  //even if we dont want to get props, still have to write it here indicating the second arg is ref
  const [modalState, setModalState] = useState(false); //we'll keep the states inside the child/modal component, not getting it as props from parentcomponent

  useImperativeHandle(ref, () => ({
    openModal: () => setModalState(true),
    //we can define as many functions here as we want
    //all those functions will be available to the parent
  }));

  console.log("child rendered");
  if (!modalState) return null;
  return (
    <div className={classes.modal_wrapper}>
      <div className={classes.modal}>
        <div className={classes.body}>
          <h1>Order Details</h1>
        </div>
        <div className={classes.footer}>
          <button onClick={() => setModalState(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(OrderModal); //to make this component work, it must be wrapped inside forwardRef hook
