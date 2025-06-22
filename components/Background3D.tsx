'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

function Model({ url, position, rotation, scale }: { 
  url: string; 
  position: [number, number, number]; 
  rotation: [number, number, number];
  scale: number;
}) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.transparent = true;
        child.material.opacity = 0.8;
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.children[0].rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

function Loading() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#cccccc" transparent opacity={0.1} />
    </mesh>
  );
}

export default function Background3D() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<Loading />}>
          <Model 
            url="/1.glb" 
            position={[-7, 3, -3]} 
            rotation={[0, Math.PI / 4, 0]}
            scale={0.5}
          />
          
          <Model 
            url="/7525124.glb" 
            position={[5, -3, 1]} 
            rotation={[0, -Math.PI / 3, 0]}
            scale={0.9}
          />
          
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={0.3} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />
          
          {/* Controles opcionales (comentado para que no interfiera con la UI) */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
        </Suspense>
      </Canvas>
    </div>
  );
} 