import React, { useState } from "react";
import axios from "axios";
import ContactForm from "./Form";

const ContactDropDown = ({Component, Message = "Toggle Component"}) => {
  const [showComponent, setShowComponent] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column"}}>
    <button onClick={handleClick} style={{alignSelf: "flex-end"}}>{Message}</button>
      {showComponent && Component}
    </div>
  );
};

export default ContactDropDown;