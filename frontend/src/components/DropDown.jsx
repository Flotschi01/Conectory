import React, { useState } from "react";

const DropDown = ({Component, Message = "Toggle Component", PassdownProps}) => {
  const [showComponent, setShowComponent] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", padding:"10px"}}>
    <button type="button" onClick={handleClick} style={{alignSelf: "flex-end", width: "100%"}}>{Message} {showComponent ? "▲" : "▼"}</button>
      {showComponent && React.cloneElement(Component, {
      PassdownProps:PassdownProps
    })}
    </div>
  );
};

export default DropDown;