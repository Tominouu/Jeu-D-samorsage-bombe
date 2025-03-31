import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const { joinGame, startGame } = useGame();

  const handleRoleSelect = (role) => {
    joinGame(role);
    if (role === 'bomb') {
      startGame();
    }
    navigate(`/${role}`);
  };

  return (
    <div className="home-container">
      <h1>Jeu de Désamorçage de Bombe</h1>
      <div className="role-selection">
        <button 
          className="role-button bomb"
          onClick={() => handleRoleSelect('bomb')}
        >
          Je vois la bombe
        </button>
        <button 
          className="role-button manual"
          onClick={() => handleRoleSelect('manual')}
        >
          Je vois le manuel
        </button>
      </div>
    </div>
  );
}

export default Home; 