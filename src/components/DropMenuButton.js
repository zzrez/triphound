import React, { useState } from "react";
import "./DropMenuButton.css";
import DropMenu from "./DropMenu";

const DropMenuButton = props => {
  const [visible, setVisible] = useState("");

  const handleMouseDown = () => {
    toggleMenu();
    console.log("clicked");
    //e.stopPropagation();
  };

  const toggleMenu = () => {
    setVisible(!visible);
  };
  return (
    <div>
      <button id={props.id} onMouseDown={handleMouseDown}>
        {props.title}
      </button>
      <DropMenu handleMouseDown={handleMouseDown} menuVisibility={visible} />
    </div>
  );
};

export default DropMenuButton;
