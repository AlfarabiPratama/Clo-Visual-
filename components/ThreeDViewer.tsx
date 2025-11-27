import React, { useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, useTexture, Capsule } from '@react-three/drei';
import * as THREE from 'three';

// Fix for TypeScript errors regarding missing intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      meshStandardMaterial: any;
    }
  }
}

interface ThreeDViewerProps {
  color: string;
  textureUrl: string | null;
  garmentType: string;
}

// Separate component for textured material to conditionally call useTexture safely
const TexturedMaterial: React.FC<{ url: string; color: string }> = ({ url, color }) => {
  const texture = useTexture(url);

  useLayoutEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
    }
  }, [texture]);

  return (
    <meshStandardMaterial 
      color={color} 
      map={texture} 
      roughness={0.7}
      metalness={0.1}
    />
  );
};

const MannequinDisplay: React.FC<{ color: string; textureUrl: string | null }> = ({ color, textureUrl }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      // Slow rotation
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      {/* 
        Ideally, we would load a GLB here using useGLTF.
        For this prototype, to ensure it works without external assets, 
        we simulate a garment on a form using a Capsule geometry.
      */}
      <Capsule ref={meshRef} args={[0.8, 2.5, 4, 16]} position={[0, 0, 0]}>
        {textureUrl ? (
          <TexturedMaterial url={textureUrl} color={color} />
        ) : (
          <meshStandardMaterial 
            color={color} 
            roughness={0.7}
            metalness={0.1}
          />
        )}
      </Capsule>
    </group>
  );
};

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ color, textureUrl, garmentType }) => {
  return (
    <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-500 pointer-events-none">
        Interactive 3D Preview • {garmentType}
      </div>
      
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <React.Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
             <MannequinDisplay color={color} textureUrl={textureUrl} />
          </Stage>
        </React.Suspense>
        <OrbitControls autoRotate={false} makeDefault />
      </Canvas>
      
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-gray-400 pointer-events-none">
        Powered by Three.js
      </div>
    </div>
  );
};

export default ThreeDViewer;