import React, { useState } from "react";

const MiniMapContext = React.createContext();

function useMiniMap() {
  const context = React.useContext(MiniMapContext);
  if (!context) {
    throw new Error("useMiniMap must be used within a MiniMapProvider");
  }
  return context;
}

function MiniMapProvider(props) {
  const [miniMapVisible, setMiniMapVisible] = useState(true);
  return (
    <MiniMapContext.Provider
      value={{ miniMapVisible, setMiniMapVisible }}
      {...props}
    />
  );
}

export { MiniMapProvider, useMiniMap };
