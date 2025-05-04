import React, { useState, useContext } from "react";
import Popup from "../components/Popup";

const PopupContext = React.createContext();
export const usePopup = () => {
  return useContext(PopupContext);
};

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    message: "",
    duration: 3000,
    type: "success",
    isVisible: false,
  });

  const showPopup = ({ message, duration = 3000, type = "success" }) => {
    setPopup({ message, duration, type, isVisible: true });
  };

  const hidePopup = () => {
    setPopup((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup.isVisible && (
        <Popup
          message={popup.message}
          duration={popup.duration}
          type={popup.type}
          onclose={hidePopup}
        />
      )}
    </PopupContext.Provider>
  );
};
