import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Home from './pages/Home';
import BombView from './pages/BombView';
import ManualView from './pages/ManualView';

function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bomb" element={<BombView />} />
        <Route path="/manual" element={<ManualView />} />
      </Routes>
    </GameProvider>
  );
}

export default App; 