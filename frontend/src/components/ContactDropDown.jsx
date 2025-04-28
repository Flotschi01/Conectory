import React, { useState } from "react";
import axios from "axios";
import ContactForm from "./ContactForm";

const ContactDropDown = ({Component, Message = "Toggle Component"}) => {
  const [showComponent, setShowComponent] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  };
  return (
    <div>
    <button onClick={handleClick}>{Message}</button>
      {showComponent && Component}
      </div>
  );
};

export default ContactDropDown;