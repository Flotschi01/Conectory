import React from "react";
import axios from "axios";

const DeleteBtn = ({ contId, onDelete }) => {
  const handleDelete = async () => {
    try {
      // Make DELETE request to API
      await axios.delete(`http://localhost:5000/contacts/${contId}`);
      console.log("Deleted contact with ID:", contId);
      
      // Call the parent's refresh function
      onDelete();
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

export default DeleteBtn;