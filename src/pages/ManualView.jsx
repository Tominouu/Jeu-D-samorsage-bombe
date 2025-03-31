import React, { useState } from 'react';
import '../styles/ManualView.css';

function ManualView() {
  const [activeModule, setActiveModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const modules = {
    'Fils': {
      description: 'Module de fils à couper',
      instructions: [
        'Si le fil est rouge et le dernier chiffre du timer est impair, couper le fil rouge',
        'Si le fil est bleu et il y a plus de 3 fils, couper le fil bleu',
        'Si le fil est jaune et le timer affiche moins de 60 secondes, couper le fil jaune',
        'Sinon, couper le fil vert'
      ]
    },
    'Bouton': {
      description: 'Module de bouton',
      instructions: [
        'Maintenir le bouton enfoncé',
        'Observer la couleur de la bande lumineuse',
        'Relâcher le bouton quand le timer affiche un multiple de la couleur indiquée',
        'Rouge = 2, Bleu = 3, Vert = 4, Jaune = 5'
      ]
    },
    'Code': {
      description: 'Module de code',
      instructions: [
        'Entrer le code à 4 chiffres',
        'Le code est basé sur le nombre de fils de chaque couleur',
        'Rouge = premier chiffre',
        'Bleu = deuxième chiffre',
        'Vert = troisième chiffre',
        'Jaune = quatrième chiffre'
      ]
    }
  };

  const filteredModules = Object.entries(modules).filter(([name, module]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manual-view">
      <div className="manual-header">
        <h1>Manuel de Désamorçage</h1>
        <input
          type="text"
          placeholder="Rechercher un module..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="manual-content">
        <div className="modules-list">
          {filteredModules.map(([name, module]) => (
            <div
              key={name}
              className={`module-item ${activeModule === name ? 'active' : ''}`}
              onClick={() => setActiveModule(name)}
            >
              <h2>{name}</h2>
              <p>{module.description}</p>
            </div>
          ))}
        </div>

        <div className="module-details">
          {activeModule && (
            <>
              <h2>{activeModule}</h2>
              <div className="instructions">
                {modules[activeModule].instructions.map((instruction, index) => (
                  <div key={index} className="instruction-step">
                    <span className="step-number">{index + 1}</span>
                    <p>{instruction}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManualView; 