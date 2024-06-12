import classes from "./modal.module.css";

const Modal = ({ show, onCloseButtonClick, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={classes.modal_wrapper}>
      <div className={classes.modal}>
        <div className={classes.body}>{children}</div>
        <div className={classes.footer}>
          <button onClick={onCloseButtonClick}>Close Modal</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
