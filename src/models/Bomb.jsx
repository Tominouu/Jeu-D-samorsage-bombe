import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';

export function Bomb({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const bombRef = useRef();

  // Animation de pulsation
  useEffect(() => {
    gsap.to(bombRef.current.scale, {
      x: scale * 1.02,
      y: scale * 1.02,
      z: scale * 1.02,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, [scale]);

  // Création de la bombe avec plus de détails
  return (
    <group ref={bombRef} position={position} rotation={rotation} scale={scale}>
      {/* Corps principal de la bombe */}
      <mesh>
        <cylinderGeometry args={[1, 1, 2, 32]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Détails de la bombe */}
      <mesh position={[0, 1, 0]}>
        <torusGeometry args={[1.1, 0.05, 16, 32]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff0000"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Écran LCD */}
      <mesh position={[0.5, 0.5, 1.01]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Boutons et interrupteurs */}
      {[...Array(3)].map((_, i) => (
        <group key={i} position={[-0.5 + i * 0.5, 0.5, 1.01]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Fils */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[-0.8 + i * 0.5, -0.5, 1.01]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
          <meshStandardMaterial
            color={['#ff0000', '#0000ff', '#ffff00', '#00ff00'][i]}
            emissive={['#ff0000', '#0000ff', '#ffff00', '#00ff00'][i]}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Effet de lueur */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
} 