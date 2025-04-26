import React, { useState } from "react";
import axios from "axios";
import ContactForm from "./ContactForm";

const ContactDropDown = ({Component}) => {
  const [showComponent, setShowComponent] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  };
  return (
    <div>
    <button onClick={handleClick}>Toggle Component</button>
      {console.log(Component)}
      {showComponent && Component}
      </div>
  );
};

export default ContactDropDown;