// Notification.js
import React, { useEffect } from "react";

export const Notification = ({ message, onClose }: any) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer); // Clean up the timer if the component unmounts
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        padding: "10px",
        backgroundColor: "red",
        color: "white",
        borderRadius: "5px",
        zIndex: 1100,
        opacity: "show" ? 1 : 0,
        transition: "opacity 2s ease-out",
      }}
    >
      {message}
    </div>
  );
};
