import React, { useState } from "react";

const Context = React.createContext();

export function CurrentLocationStore(props) {
  const [currentLocation, setCurrentLocation] = useState({
    latlng: [65, 15],
    zoom: 4,
  });

  return (
    <Context.Provider value={{ currentLocation, setCurrentLocation }}>
      {props.children}
    </Context.Provider>
  );
}

export default Context;
