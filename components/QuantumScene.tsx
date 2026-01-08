/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Box, TorusKnot, Line, Stars, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

const GlowingStack = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.rotation.y = t * 0.2;
      ref.current.rotation.x = Math.sin(t * 0.5) * 0.1;
      ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <Box args={[1, 0.2, 1]} position={[0, 0, 0]}>
         <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </Box>
      <Box args={[1, 0.05, 1]} position={[0, 0.125, 0]}>
         <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </Box>
       <Box args={[1, 0.2, 1]} position={[0, 0.3, 0]} rotation={[0, 0.2, 0]}>
         <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </Box>
       <Box args={[1, 0.05, 1]} position={[0, 0.425, 0]} rotation={[0, 0.2, 0]}>
         <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </Box>
       <Box args={[1, 0.2, 1]} position={[0, 0.6, 0]} rotation={[0, 0.4, 0]}>
         <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
      </Box>
    </group>
  );
};

const TwistedKnot = () => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const t = state.clock.getElapsedTime();
       ref.current.rotation.x = t * 0.1;
       ref.current.rotation.y = t * 0.15;
    }
  });

  return (
    <TorusKnot ref={ref} args={[2, 0.4, 128, 32]} position={[0, 0, -2]}>
      <meshPhysicalMaterial 
        color="#0066cc" 
        emissive="#000033"
        roughness={0.2}
        metalness={1}
        clearcoat={1}
        wireframe={true}
      />
    </TorusKnot>
  );
}

const ConnectionLines = ({ count = 20 }) => {
    const lines = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const start = [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5];
            const end = [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5];
            temp.push({ start, end });
        }
        return temp;
    }, [count]);

    return (
        <group>
            {lines.map((l, i) => (
                <Line 
                    key={i} 
                    points={[l.start as [number,number,number], l.end as [number,number,number]]} 
                    color="#3399ff" 
                    opacity={0.2} 
                    transparent 
                    lineWidth={1} 
                />
            ))}
        </group>
    )
}

export const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3399ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
           <TwistedKnot />
        </Float>
        
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
           <GlowingStack position={[-3, 1, 0]} color="#3399ff" scale={0.8} />
           <GlowingStack position={[3, -1, 1]} color="#a855f7" scale={0.8} />
           <GlowingStack position={[0, 3, -3]} color="#10b981" scale={0.6} />
        </Float>

        <ConnectionLines count={30} />

        <Environment preset="city" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <fog attach="fog" args={['#050505', 5, 20]} />
      </Canvas>
    </div>
  );
};

export const NetworkScene: React.FC = () => {
    // A simplified scene for smaller visualisations if needed
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#3399ff" />
        <Float rotationIntensity={0.4} floatIntensity={0.2} speed={1}>
            <TorusKnot args={[1.5, 0.2, 100, 16]}>
                 <meshStandardMaterial color="#3399ff" wireframe />
            </TorusKnot>
        </Float>
      </Canvas>
    </div>
  );
}