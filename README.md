# Jeu de Désamorçage de Bombe

Un jeu multijoueur inspiré de "Keep Talking and Nobody Explodes" où les joueurs doivent collaborer pour désamorcer une bombe virtuelle.

## Fonctionnalités

- Interface 3D interactive pour la bombe
- Manuel de désamorçage interactif
- Communication en temps réel entre les joueurs
- Modules variés et aléatoires
- Minuterie pour ajouter du stress
- Interface utilisateur moderne et intuitive

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

## Installation

1. Clonez le dépôt :
```bash
git clone [URL_DU_REPO]
cd jeu-desamorcage-bombe
```

2. Installez les dépendances :
```bash
npm install
```

## Lancement

1. Démarrez le serveur de développement :
```bash
npm run dev
```

2. Ouvrez votre navigateur et accédez à :
```
http://localhost:3000
```

## Comment jouer

1. Un joueur doit ouvrir l'application dans un navigateur et choisir "Je vois la bombe"
2. Les autres joueurs doivent ouvrir l'application dans un autre navigateur et choisir "Je vois le manuel"
3. Le joueur avec la bombe doit décrire ce qu'il voit aux autres joueurs
4. Les joueurs avec le manuel doivent guider le joueur avec la bombe pour désamorcer les modules
5. Le but est de désamorcer tous les modules avant que le temps ne s'écoule

## Technologies utilisées

- Three.js pour le rendu 3D
- React pour l'interface utilisateur
- Socket.IO pour la communication en temps réel
- GSAP pour les animations
- Vite pour le bundling et le développement

## Structure du projet

```
jeu-desamorcage-bombe/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── BombView.jsx
│   │   └── ManualView.jsx
│   ├── styles/
│   │   ├── Home.css
│   │   ├── BombView.css
│   │   └── ManualView.css
│   ├── App.jsx
│   └── main.jsx
├── server.js
├── package.json
└── README.md
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT 