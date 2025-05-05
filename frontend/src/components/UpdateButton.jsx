import React from "react";
import axios from "axios";
import { useRefresh } from "./useRefresh";

const UpdateButton = ({ contId }) => {
  const { setUpdateID } = useRefresh();
  const handleUpdate = async () => {
    setUpdateID(contId);
  };

  return (
    <button onClick={handleUpdate}>
      Update
    </button>
  );
};

export default UpdateButton;