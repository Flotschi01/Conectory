import React, { useState } from "react";
import axios from "axios";
import ContactForm from "./ContactForm";

const ContactDropDown = ({ contId, onDelete }) => {
  const [showComponent, setShowComponent] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  };
  return (
    <div>
    <button onClick={handleClick}>Toggle Component</button>
      {showComponent && <ContactForm />}
      </div>
  );
};

export default ContactDropDown;