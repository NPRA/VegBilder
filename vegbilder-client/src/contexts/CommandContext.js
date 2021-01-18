import React, { useState } from 'react';

const commandTypes = {
  goForwards: 'goForwards',
  goBackwards: 'goBackwards',
  turnAround: 'turnAround',
  selectNearestImagePointToCurrentCoordinates: 'selectNearestImagePointToCurrentCoordinates',
  selectNearestImagePointToCurrentImagePoint: 'selectNearestImagePointToCurrentImagePoint',
};

const CommandContext = React.createContext();

function useCommand() {
  const context = React.useContext(CommandContext);
  if (!context) {
    throw new Error('useCommand must be used within a CommandProvider');
  }
  return context;
}

function CommandProvider(props) {
  const [command, setCommandInternal] = useState(null);

  function setCommand(command) {
    switch (command) {
      case commandTypes.goForwards:
      case commandTypes.goBackwards:
      case commandTypes.turnAround:
      case commandTypes.selectNearestImagePointToCurrentCoordinates:
      case commandTypes.selectNearestImagePointToCurrentImagePoint:
        setCommandInternal(command);
        break;
      default:
        throw new Error(`Tried to issue invalid command: ${command}`);
    }
  }

  function resetCommand() {
    setCommandInternal(null);
  }

  return <CommandContext.Provider value={{ command, setCommand, resetCommand }} {...props} />;
}

export { CommandProvider, useCommand, commandTypes };
