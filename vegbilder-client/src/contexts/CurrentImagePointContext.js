import React, { useState } from "react";

const Context = React.createContext();

export function CurrentImagePointStore(props) {
  const [currentImagePoint, setCurrentImagePoint] = useState(null);

  return (
    <Context.Provider value={{ currentImagePoint, setCurrentImagePoint }}>
      {props.children}
    </Context.Provider>
  );
}

export default Context;
