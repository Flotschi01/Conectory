import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const EnumPicker = ({ name, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);
  const handleSelect = (option) => {
    const syntheticEvent = {
      target: {
        name,
        value: option,
      }
    };
    onChange(syntheticEvent); // just like a normal input
    setIsOpen(false);
};


  return (
    <>
      <div
        className="picker-display"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || "Select..."} ▼
      </div>

      {isOpen &&
        createPortal(
          <ul
            className="picker-options"
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 999,
              background: "white",
              border: "1px solid #ccc",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              margin: 0,
              padding: 0,
              listStyle: "none"
            }}
          >
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                style={{ padding: "8px", cursor: "pointer"}}
              >
                {option}
              </li>
            ))}
          </ul>,
          document.getElementById("portal-root")
        )}
    </>
  );
};

export default EnumPicker;
