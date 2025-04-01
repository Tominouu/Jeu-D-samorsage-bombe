import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Bomb } from '../models/Bomb';
import { useGame } from '../context/GameContext';
import '../styles/BombView.css';

function BombView() {
  const { gameState, updateBombState, handleModuleAction, handleGameOver } = useGame();
  const [selectedModule, setSelectedModule] = useState(null);
  const [timer, setTimer] = useState(300);

  // Gestion du timer
  useEffect(() => {
    if (gameState.isGameActive && timer > 0 && gameState.gameStatus === 'playing') {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState.isGameActive, timer, gameState.gameStatus, handleGameOver]);

  // Mise à jour de l'état du jeu
  useEffect(() => {
    updateBombState({ timeLeft: timer });
  }, [timer, updateBombState]);

  const handleModuleClick = (module) => {
    setSelectedModule(module);
  };

  const handleWireCut = (wireIndex) => {
    if (!selectedModule) return;
    handleModuleAction(selectedModule.id, {
      wires: selectedModule.state.wires.map((w, i) => 
        i === wireIndex ? { ...w, isCut: true } : w
      )
    });
  };

  const handleButtonPress = () => {
    if (!selectedModule) return;
    handleModuleAction(selectedModule.id, { isPressed: true });
  };

  const handleButtonRelease = () => {
    if (!selectedModule) return;
    handleModuleAction(selectedModule.id, { isPressed: false });
  };

  const handleCodeInput = (value) => {
    if (!selectedModule) return;
    handleModuleAction(selectedModule.id, { enteredCode: value });
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
          camera={{ position: [0, 2, 5], fov: 75 }}
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
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />

          {/* Environnement */}
          <Environment preset="warehouse" />

          {/* Sol */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#333333" />
          </mesh>

          {/* Bombe */}
          <Bomb position={[0, 0, 0]} scale={1} />

          {/* Effets post-processing */}
          <fog attach="fog" args={['#000000', 5, 20]} />
        </Canvas>
      </div>

      <div className="ui-overlay">
        <div className={`timer ${timer < 60 ? 'warning' : ''}`}>
          Temps restant: {formatTime(timer)}
        </div>
        
        {gameState.gameStatus === 'won' && (
          <div className="game-status won">
            <h2>Félicitations ! La bombe a été désamorcée !</h2>
          </div>
        )}
        
        {gameState.gameStatus === 'lost' && (
          <div className="game-status lost">
            <h2>Game Over ! {gameState.errorMessage}</h2>
          </div>
        )}

        {gameState.gameStatus === 'playing' && (
          <>
            <div className="modules">
              {gameState.modules.map(module => (
                <div
                  key={module.id}
                  className={`module ${selectedModule?.id === module.id ? 'selected' : ''} ${module.isSolved ? 'solved' : ''}`}
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
                        onClick={() => handleWireCut(index)}
                        disabled={wire.isCut}
                      />
                    ))}
                  </div>
                )}
                {selectedModule.type === 'Bouton' && (
                  <button
                    className={`bomb-button ${selectedModule.state.isPressed ? 'pressed' : ''}`}
                    onMouseDown={handleButtonPress}
                    onMouseUp={handleButtonRelease}
                    onMouseLeave={handleButtonRelease}
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
                      onChange={(e) => handleCodeInput(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BombView; 