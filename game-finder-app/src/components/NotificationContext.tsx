import React, { createContext, useState, useContext, ReactNode } from "react";

interface NotificationContextProps {
  showNotification: (message: string, type: "error" | "success") => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success";
  }>({ message: "", type: "success" });

  const showNotification = (message: string, type: "error" | "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "success" });
    }, 2000); // Adjust the timeout to match the fade-out duration
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification.message && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            padding: "10px",
            backgroundColor: notification.type === "error" ? "red" : "green",
            color: "white",
            borderRadius: "5px",
            zIndex: 1100,
            opacity: 1,
            transition: "opacity 2s ease-out",
          }}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
