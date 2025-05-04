import React, { useState, useEffect } from "react";

import "../styles/Popup.css";

const Popup = ({ message, duration, type, onclose }) => {
  const [visible, setVisible] = useState(true);
  const [animationClass, setAnimationClass] = useState("fade-in");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationClass("fade-out");
      setTimeout(() => {
        setVisible(false);
        onclose(); // Call the onclose function after the fade-out animation
      }, 300); // Match this duration with your CSS fade-out duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onclose]);

  if (!visible) return null;

  return (
    <div className={`popup ${type} ${animationClass}`}>
      <p>{message}</p>
    </div>
  );
};
export default Popup;
