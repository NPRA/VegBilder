import React, { useState } from "react";

const Context = React.createContext();

export function CurrentLocationStore(props) {
  const [currentLocation, setCurrentLocation] = useState([65, 15]);

  return (
    <Context.Provider value={{ currentLocation, setCurrentLocation }}>
      {props.children}
    </Context.Provider>
  );
}

export default Context;
