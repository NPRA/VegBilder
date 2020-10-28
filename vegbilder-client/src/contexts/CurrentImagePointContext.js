import React, { useState } from "react";

const CurrentImagePointContext = React.createContext();

function useCurrentImagePoint() {
  const context = React.useContext(CurrentImagePointContext);
  if (!context) {
    throw new Error(
      "useCurrentImagePoint must be used within a CurrentImagePointProvider"
    );
  }
  return context;
}

function CurrentImagePointProvider(props) {
  const [currentImagePoint, setCurrentImagePoint] = useState(null);
  return (
    <CurrentImagePointContext.Provider
      value={{ currentImagePoint, setCurrentImagePoint }}
      {...props}
    />
  );
}

export { CurrentImagePointProvider, useCurrentImagePoint };
