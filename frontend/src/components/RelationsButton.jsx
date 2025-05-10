import React from "react";
import { useGlobal } from "./GlobalContext";

const RelationsButton = ({ contId }) => {
    const { setPersID } = useGlobal();

  const handleUpdate = async () => {
    setPersID(contId)
  };

  return (
    <button onClick={handleUpdate}>
      Add
    </button>
  );
};

export default RelationsButton;