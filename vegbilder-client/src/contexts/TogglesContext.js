import React, { useState } from "react";

const TogglesContext = React.createContext();

function useToggles() {
  const context = React.useContext(TogglesContext);
  if (!context) {
    throw new Error("useToggles must be used within a TogglesProvider");
  }
  return context;
}

function TogglesProvider(props) {
  const [miniMapVisible, setMiniMapVisible] = useState(true);
  return (
    <TogglesContext.Provider
      value={{ miniMapVisible, setMiniMapVisible }}
      {...props}
    />
  );
}

export { TogglesProvider, useToggles };
