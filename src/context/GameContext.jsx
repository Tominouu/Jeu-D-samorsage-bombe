import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    timeLeft: 300,
    modules: [],
    isGameActive: false,
    role: null,
    gameStatus: 'waiting', // waiting, playing, won, lost
    errorMessage: null
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
      updateBombState({ 
        modules, 
        timeLeft: 300,
        gameStatus: 'playing',
        errorMessage: null
      });
    }
  };

  const checkModuleSolution = (module) => {
    switch (module.type) {
      case 'Fils':
        return module.state.wires.every(wire => wire.isCut === shouldCutWire(wire, gameState));
      case 'Bouton':
        return module.state.isPressed && checkButtonRelease(module);
      case 'Code':
        return module.state.enteredCode === module.state.code;
      default:
        return false;
    }
  };

  const shouldCutWire = (wire, gameState) => {
    const lastDigit = gameState.timeLeft % 10;
    const wireCount = gameState.modules
      .filter(m => m.type === 'Fils')
      .reduce((acc, m) => acc + m.state.wires.length, 0);

    switch (wire.color) {
      case 'red':
        return lastDigit % 2 === 1;
      case 'blue':
        return wireCount > 3;
      case 'yellow':
        return gameState.timeLeft < 60;
      case 'green':
        return true;
      default:
        return false;
    }
  };

  const checkButtonRelease = (module) => {
    const timeLeft = gameState.timeLeft;
    const colorMultiplier = {
      red: 2,
      blue: 3,
      green: 4,
      yellow: 5
    }[module.state.lightColor];

    return timeLeft % colorMultiplier === 0;
  };

  const handleModuleAction = (moduleId, action) => {
    const updatedModules = gameState.modules.map(module => {
      if (module.id === moduleId) {
        const newState = {
          ...module.state,
          ...action
        };

        // Vérifier si le module est résolu
        if (checkModuleSolution({ ...module, state: newState })) {
          return {
            ...module,
            state: newState,
            isSolved: true
          };
        }

        return {
          ...module,
          state: newState
        };
      }
      return module;
    });

    // Vérifier si tous les modules sont résolus
    const allSolved = updatedModules.every(module => module.isSolved);
    if (allSolved) {
      updateBombState({ 
        modules: updatedModules,
        gameStatus: 'won'
      });
    } else {
      updateBombState({ modules: updatedModules });
    }
  };

  const handleGameOver = () => {
    updateBombState({ 
      gameStatus: 'lost',
      errorMessage: 'Temps écoulé !'
    });
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
      startGame,
      handleModuleAction,
      handleGameOver
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