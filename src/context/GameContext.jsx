import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    timeLeft: 300, // 5 minutes en secondes
    modules: [],
    isGameActive: false,
    role: null
  });

  useEffect(() => {
    const newSocket = io('http://localhost:5173');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connecté au serveur');
    });

    newSocket.on('bombStateUpdate', (state) => {
      setGameState(prev => ({ ...prev, ...state }));
    });

    return () => newSocket.close();
  }, []);

  const joinGame = (role) => {
    if (socket) {
      socket.emit('joinGame', role);
      setGameState(prev => ({ ...prev, role, isGameActive: true }));
    }
  };

  const updateBombState = (state) => {
    if (socket) {
      socket.emit('updateBombState', state);
      setGameState(prev => ({ ...prev, ...state }));
    }
  };

  const startGame = () => {
    if (socket) {
      const modules = generateModules();
      updateBombState({ modules, timeLeft: 300 });
    }
  };

  const generateModules = () => {
    const moduleTypes = ['Fils', 'Bouton', 'Code'];
    const numModules = 3;
    const modules = [];

    for (let i = 0; i < numModules; i++) {
      const type = moduleTypes[Math.floor(Math.random() * moduleTypes.length)];
      modules.push({
        id: i + 1,
        type,
        isSolved: false,
        state: generateModuleState(type)
      });
    }

    return modules;
  };

  const generateModuleState = (type) => {
    switch (type) {
      case 'Fils':
        return {
          wires: [
            { color: 'red', isCut: false },
            { color: 'blue', isCut: false },
            { color: 'yellow', isCut: false },
            { color: 'green', isCut: false }
          ]
        };
      case 'Bouton':
        return {
          isPressed: false,
          lightColor: ['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)]
        };
      case 'Code':
        return {
          code: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
          enteredCode: ''
        };
      default:
        return {};
    }
  };

  return (
    <GameContext.Provider value={{
      gameState,
      socket,
      joinGame,
      updateBombState,
      startGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame doit être utilisé à l\'intérieur d\'un GameProvider');
  }
  return context;
} 