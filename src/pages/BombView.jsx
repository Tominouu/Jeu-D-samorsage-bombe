import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Bomb } from '../models/Bomb';
import { useGame } from '../context/GameContext';
import '../styles/BombView.css';

function BombView() {
  const { gameState, updateBombState } = useGame();
  const [selectedModule, setSelectedModule] = useState(null);
  const [timer, setTimer] = useState(300);

  // Gestion du timer
  useEffect(() => {
    if (gameState.isGameActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Game Over
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState.isGameActive, timer]);

  // Mise à jour de l'état du jeu
  useEffect(() => {
    updateBombState({ timeLeft: timer });
  }, [timer, updateBombState]);

  const handleModuleClick = (module) => {
    setSelectedModule(module);
  };

  const handleModuleAction = (action) => {
    if (!selectedModule) return;

    const updatedModules = gameState.modules.map(module => {
      if (module.id === selectedModule.id) {
        return {
          ...module,
          state: {
            ...module.state,
            ...action
          }
        };
      }
      return module;
    });

    updateBombState({ modules: updatedModules });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bomb-view">
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: '#1a1a1a' }}
        >
          <PerspectiveCamera makeDefault />
          <OrbitControls enableDamping />
          
          {/* Éclairage */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
          />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />

          {/* Environnement */}
          <Environment preset="warehouse" />

          {/* Bombe */}
          <Bomb position={[0, 0, 0]} scale={1} />

          {/* Effets post-processing */}
          <fog attach="fog" args={['#000000', 5, 20]} />
        </Canvas>
      </div>

      <div className="ui-overlay">
        <div className="timer">Temps restant: {formatTime(timer)}</div>
        <div className="modules">
          {gameState.modules.map(module => (
            <div
              key={module.id}
              className={`module ${selectedModule?.id === module.id ? 'selected' : ''}`}
              onClick={() => handleModuleClick(module)}
            >
              Module {module.id}
            </div>
          ))}
        </div>
        {selectedModule && (
          <div className="module-controls">
            {selectedModule.type === 'Fils' && (
              <div className="wires">
                {selectedModule.state.wires.map((wire, index) => (
                  <button
                    key={index}
                    className={`wire ${wire.color} ${wire.isCut ? 'cut' : ''}`}
                    onClick={() => handleModuleAction({
                      wires: selectedModule.state.wires.map((w, i) => 
                        i === index ? { ...w, isCut: true } : w
                      )
                    })}
                  />
                ))}
              </div>
            )}
            {selectedModule.type === 'Bouton' && (
              <button
                className={`bomb-button ${selectedModule.state.isPressed ? 'pressed' : ''}`}
                onMouseDown={() => handleModuleAction({ isPressed: true })}
                onMouseUp={() => handleModuleAction({ isPressed: false })}
              >
                Maintenir
              </button>
            )}
            {selectedModule.type === 'Code' && (
              <div className="code-input">
                <input
                  type="text"
                  maxLength="4"
                  value={selectedModule.state.enteredCode}
                  onChange={(e) => handleModuleAction({ enteredCode: e.target.value })}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BombView; 