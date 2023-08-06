import cn from "classnames";
import styles from "./index.module.css";
import { useEffect, useRef } from "react";

function Modal({ children, handleCloseModal }) {
  const divRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        handleCloseModal();
      }
    }

    function handleKeyPress(event) {
      if (event.keyCode === 27) {
        handleCloseModal();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress); 
    };
  }, [divRef]);

  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.boxContent)} ref={divRef}>
        <div className={cn(styles.bodyModal)}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
