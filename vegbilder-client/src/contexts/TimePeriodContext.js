import React, { useState } from "react";

const TimePeriodContext = React.createContext();

const timePeriods = ["2020", "2019"];

function useTimePeriod() {
  const context = React.useContext(TimePeriodContext);
  if (!context) {
    throw new Error("useTimePeriod must be used within a TimePeriodProvider");
  }
  return context;
}

function TimePeriodProvider(props) {
  const [timePeriod, setTimePeriodInternal] = useState(timePeriods[0]);

  function setTimePeriod(timePeriod) {
    if (timePeriods.indexOf(timePeriod) !== -1) {
      setTimePeriodInternal(timePeriod);
    } else {
      throw new Error(`Tried to set invalid time period: ${timePeriod}`);
    }
  }
  return (
    <TimePeriodContext.Provider
      value={{ timePeriod, setTimePeriod }}
      {...props}
    />
  );
}

export { TimePeriodProvider, useTimePeriod, timePeriods };
