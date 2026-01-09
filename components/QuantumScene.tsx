/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Simplified "Cult Symbol" Particle System
 * Black & white dots that morph into sacred geometry
 */

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Symbol definitions - sacred geometry patterns
const SYMBOLS = {
  // Triquetra / Trinity knot (simplified)
  triquetra: (t: number, i: number, total: number) => {
    const angle = (i / total) * Math.PI * 6 + t * 0.5;
    const r = 1.5 + 0.5 * Math.sin(angle * 3);
    return {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
      z: Math.sin(angle * 2) * 0.3
    };
  },
  // Twisted double helix (DNA-like)
  helix: (t: number, i: number, total: number) => {
    const y = (i / total) * 6 - 3;
    const angle = y * 2 + t;
    const strand = i % 2 === 0 ? 1 : -1;
    return {
      x: Math.cos(angle) * 1.5 * strand,
      y: y,
      z: Math.sin(angle) * 1.5
    };
  },
  // Vesica Piscis (overlapping circles)
  vesica: (t: number, i: number, total: number) => {
    const half = total / 2;
    const isFirst = i < half;
    const idx = isFirst ? i : i - half;
    const angle = (idx / half) * Math.PI * 2 + t * 0.3;
    const offset = isFirst ? -0.7 : 0.7;
    return {
      x: Math.cos(angle) * 1.2 + offset,
      y: Math.sin(angle) * 1.8,
      z: Math.sin(t + angle) * 0.2
    };
  },
  // Chaos / scattered
  chaos: (t: number, i: number, total: number) => {
    const seed = i * 12.9898;
    const rand = (s: number) => Math.sin(s) * 43758.5453 % 1;
    return {
      x: (rand(seed) - 0.5) * 6 + Math.sin(t + seed) * 0.3,
      y: (rand(seed + 1) - 0.5) * 6 + Math.cos(t + seed) * 0.3,
      z: (rand(seed + 2) - 0.5) * 3
    };
  },
  // Spiral / vortex
  spiral: (t: number, i: number, total: number) => {
    const angle = (i / total) * Math.PI * 8 + t * 0.5;
    const r = (i / total) * 2.5 + 0.5;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      z: (i / total - 0.5) * 2
    };
  }
};

const SYMBOL_ORDER: (keyof typeof SYMBOLS)[] = ['chaos', 'spiral', 'triquetra', 'helix', 'vesica'];

interface ParticleFieldProps {
  count?: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ count = 200 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [symbolIndex, setSymbolIndex] = useState(0);
  const transitionRef = useRef(0);
  const prevPositions = useRef<{ x: number; y: number; z: number }[]>([]);
  const targetPositions = useRef<{ x: number; y: number; z: number }[]>([]);

  // Cycle through symbols
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbolIndex((prev) => (prev + 1) % SYMBOL_ORDER.length);
      transitionRef.current = 0;
    }, 6000); // Change symbol every 6 seconds
    return () => clearInterval(interval);
  }, []);

  // Initialize positions
  useMemo(() => {
    prevPositions.current = Array(count).fill(null).map((_, i) =>
      SYMBOLS.chaos(0, i, count)
    );
    targetPositions.current = [...prevPositions.current];
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const baseSize = 0.04;

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();
    const currentSymbol = SYMBOL_ORDER[symbolIndex];
    const symbolFn = SYMBOLS[currentSymbol];

    // Smooth transition
    transitionRef.current = Math.min(transitionRef.current + 0.01, 1);
    const ease = 1 - Math.pow(1 - transitionRef.current, 3); // Ease out cubic

    // Update target positions when symbol changes
    if (transitionRef.current < 0.02) {
      prevPositions.current = targetPositions.current.map(p => ({ ...p }));
      targetPositions.current = Array(count).fill(null).map((_, i) =>
        symbolFn(t, i, count)
      );
    }

    for (let i = 0; i < count; i++) {
      const target = symbolFn(t, i, count);
      const prev = prevPositions.current[i] || target;

      // Interpolate position
      const x = prev.x + (target.x - prev.x) * ease;
      const y = prev.y + (target.y - prev.y) * ease;
      const z = prev.z + (target.z - prev.z) * ease;

      dummy.position.set(x, y, z);

      // Subtle size pulsing
      const pulse = 1 + Math.sin(t * 2 + i * 0.1) * 0.2;
      const scale = baseSize * pulse;
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  );
};

// Connecting lines between particles (subtle)
const ConnectionWeb: React.FC<{ count?: number }> = ({ count = 30 }) => {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 6);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!linesRef.current) return;
    const t = state.clock.getElapsedTime();
    const positions = geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 6;
      const angle1 = (i / count) * Math.PI * 2 + t * 0.2;
      const angle2 = angle1 + Math.PI * 0.5;
      const r1 = 1 + Math.sin(t + i) * 0.5;
      const r2 = 2 + Math.cos(t * 0.5 + i) * 0.5;

      positions[idx] = Math.cos(angle1) * r1;
      positions[idx + 1] = Math.sin(angle1) * r1;
      positions[idx + 2] = Math.sin(t + i) * 0.5;
      positions[idx + 3] = Math.cos(angle2) * r2;
      positions[idx + 4] = Math.sin(angle2) * r2;
      positions[idx + 5] = Math.cos(t + i) * 0.5;
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#ffffff" opacity={0.1} transparent />
    </lineSegments>
  );
};

export const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-90 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#000000']} />

        {/* Minimal lighting - we want stark black/white */}
        <ambientLight intensity={0.1} />

        {/* Main particle field */}
        <ParticleField count={180} />

        {/* Subtle connection lines */}
        <ConnectionWeb count={20} />

        {/* Very subtle fog for depth */}
        <fog attach="fog" args={['#000000', 4, 12]} />
      </Canvas>
    </div>
  );
};

// Simplified network scene for smaller areas
export const NetworkScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.1} />
        <ParticleField count={80} />
      </Canvas>
    </div>
  );
};