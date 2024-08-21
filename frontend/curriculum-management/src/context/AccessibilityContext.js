import React, { createContext, useState, useContext } from "react";

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const refreshAccessibility = () => {
    setTriggerRefresh((prev) => !prev); // Toggle the state to trigger a recheck
  };

  return (
    <AccessibilityContext.Provider
      value={{ triggerRefresh, refreshAccessibility }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
