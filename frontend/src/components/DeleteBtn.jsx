import React from "react";
import axios from "axios";
import { useRefresh } from "./Wrapper";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
const DeleteBtn = ({ contId, table_name }) => {
  const { refresh } = useRefresh();
  const { getApiUrl } = useRefresh();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
  }
  const handleDelete = async () => {
    try {
      // Make DELETE request to API
      await axios.delete(getApiUrl() + table_name +"/" + contId);
      
      // Call the parent's refresh function
      refresh();
    } catch (error) {
      console.error("Error deleting contact:", error);
      // You could add error handling here (e.g., show a toast notification)
    }
  };
  return (
    <button onClick={handleClick} >
      Delete
      {isOpen &&
              createPortal(
                <WarnWindow handler={handleDelete} closer = {handleClick} />,
                document.getElementById("portal-root")
              )}
    </button>
  );
};
const WarnWindow = ({handler, closer}) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    useEffect(() => {
        setPosition({
          top: window.visualViewport.height/2 + window.scrollY,
          left: window.visualViewport.width / 2 - 150,
          width: "200px"
        });
    }, [window.scrollY]);
  return (
    <div
    style={{
      position: "absolute",
      top: position.top,
      left: position.left,
      width: position.width,
      backgroundColor: "white",
      border: "1px solid black"
      }}>
      <p>Are you sure you want to delete this entry and all of the entries dependent of it?</p>
      <button onClick={closer}>
        Keep
      </button>
      <button onClick={handler}>
        Delete
      </button>
    </div>
  );
};
export default DeleteBtn;