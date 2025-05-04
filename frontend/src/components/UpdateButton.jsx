import React from "react";
import axios from "axios";
import { useRefresh } from "./useRefresh";

const UpdateButton = ({ contId }) => {
  const { refresh } = useRefresh();
  const { getApiUrl } = useRefresh();
  const handleDelete = async () => {
    try {
      // Make DELETE request to API
      await axios.post(getApiUrl() +"contacts/del/" + contId);
      console.log("Deleted contact with ID:", contId);
      
      // Call the parent's refresh function
      refresh();
    } catch (error) {
      console.error("Error deleting contact:", error);
      // You could add error handling here (e.g., show a toast notification)
    }
  };

  return (
    <button onClick={handleDelete}>
      Delete
    </button>
  );
};

export default UpdateButton;