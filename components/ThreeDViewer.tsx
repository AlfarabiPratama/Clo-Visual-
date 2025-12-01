import React, { useRef, useLayoutEffect, ReactNode, forwardRef, Component } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useTexture, ContactShadows, Environment, Center, useGLTF } from '@react-three/drei';
import { EffectComposer, SSAO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { FitType, GarmentType } from '../types';

// Fix for TypeScript errors regarding missing intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface ThreeDViewerProps {
  color: string;
  textureUrl: string | null;
  garmentType: string;
  fit: FitType;
  textureScale: number;
  customModelUrl?: string | null;
}

// --- ERROR BOUNDARY ---
interface TextureErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface TextureErrorBoundaryState {
  hasError: boolean;
}

class TextureErrorBoundary extends Component<TextureErrorBoundaryProps, TextureErrorBoundaryState> {
  state: TextureErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: any): TextureErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Texture failed to load, reverting to base material.", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// --- CUSTOM GLB MODEL LOADER ---
const CustomGLBModel: React.FC<{ url: string; color: string; textureUrl: string | null; textureScale: number }> = ({ url, color, textureUrl, textureScale }) => {
  const { scene } = useGLTF(url);
  const clone = React.useMemo(() => scene.clone(), [scene]);
  
  const texture = useLoader(THREE.TextureLoader, textureUrl || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  
  useLayoutEffect(() => {
    if (textureUrl && texture) {
       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
       texture.repeat.set(textureScale, textureScale);
       // Compatible with Three.js r160+
       texture.colorSpace = THREE.SRGBColorSpace; 
    }

    clone.traverse((child: any) => {
      if (child.isMesh) {
        // Clone material to avoid affecting other instances
        child.material = child.material.clone();
        
        if (textureUrl && texture && texture.image.width > 1) {
          child.material.map = texture;
          child.material.color = new THREE.Color(0xffffff);
        } else {
          child.material.map = null;
          child.material.color = new THREE.Color(color);
        }
        
        // PBR enhancements
        child.material.roughness = 0.7;
        child.material.metalness = 0.1;
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.needsUpdate = true;
      }
    });
  }, [clone, color, textureUrl, texture, textureScale]);

  return <primitive object={clone} />;
};


// Separate component for textured material to conditionally call useTexture safely
const TexturedMaterial: React.FC<{ url: string; color: string; scale: number }> = ({ url, color, scale }) => {
  const texture = useTexture(url);

  useLayoutEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(scale, scale);
      // Compatible with Three.js r160+
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture, scale]);

  // Use MeshPhysicalMaterial for more realistic fabric rendering (sheen)
  return (
    <meshPhysicalMaterial 
      color={color} 
      map={texture} 
      roughness={0.8}
      metalness={0.0}
      sheen={0.5}
      sheenColor={new THREE.Color(0xffffff)}
      sheenRoughness={0.5}
    />
  );
};

const BaseMaterial: React.FC<{ color: string; textureUrl: string | null; textureScale: number }> = ({ color, textureUrl, textureScale }) => {
  const fallbackMaterial = (
    <meshPhysicalMaterial 
      color={color} 
      roughness={0.8}
      metalness={0.0}
      sheen={0.5}
      sheenColor={new THREE.Color(0xffffff)}
      sheenRoughness={0.5}
    />
  );

  return textureUrl ? (
    <TextureErrorBoundary key={textureUrl} fallback={fallbackMaterial}>
      <TexturedMaterial url={textureUrl} color={color} scale={textureScale} />
    </TextureErrorBoundary>
  ) : (
    fallbackMaterial
  );
};

// --- PROCEDURAL MODELS (SIMULATED HIGH-RES MOCKUPS) ---

const getFitScale = (fit: FitType): [number, number, number] => {
  switch (fit) {
    case 'Slim': return [0.9, 1, 0.9];
    case 'Oversized': return [1.15, 1, 1.15];
    case 'Regular': 
    default: return [1, 1, 1];
  }
};

const MockupTShirt: React.FC<{ color: string; textureUrl: string | null; fit: FitType; textureScale: number }> = ({ color, textureUrl, fit, textureScale }) => {
  const groupRef = useRef<THREE.Group>(null);
  const scale = getFitScale(fit);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle breathing animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={scale}>
      {/* Torso - slightly tapered for realism */}
      <group scale={[1, 1, 0.7]}> 
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.52, 0.48, 1.4, 64]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        
        {/* Collar Ring */}
        <mesh position={[0, 0.68, 0]} rotation={[Math.PI/2, 0, 0]} scale={[1, 0.8, 1]}>
          <torusGeometry args={[0.22, 0.045, 16, 64]} />
          <meshPhysicalMaterial 
            color={color} 
            roughness={0.9}
            sheen={0.2}
          />
        </mesh>
        
        {/* Collar Hole (Darkness) */}
        <mesh position={[0, 0.70, 0]} scale={[1, 0.8, 1]}>
          <cylinderGeometry args={[0.21, 0.21, 0.1, 32]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>

        {/* Bottom Hem (Inside Darkness) */}
        <mesh position={[0, -0.69, 0]}>
           <cylinderGeometry args={[0.47, 0.47, 0.05, 32]} />
           <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Sleeves - Angled downwards for natural look */}
      <group position={[-0.52, 0.4, 0]} rotation={[0, 0, Math.PI / 2.3]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.23, 0.55, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        {/* Sleeve Hem Ring */}
        <mesh position={[0, -0.27, 0]} rotation={[Math.PI/2, 0, 0]}>
           <torusGeometry args={[0.23, 0.015, 16, 32]} />
           <meshPhysicalMaterial color={color} roughness={0.9} sheen={0.2} />
        </mesh>
        {/* Sleeve Hollow */}
        <mesh position={[0, -0.28, 0]}>
           <cylinderGeometry args={[0.22, 0.22, 0.01, 32]} />
           <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      </group>

      <group position={[0.52, 0.4, 0]} rotation={[0, 0, -Math.PI / 2.3]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.23, 0.55, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        {/* Sleeve Hem Ring */}
        <mesh position={[0, -0.27, 0]} rotation={[Math.PI/2, 0, 0]}>
           <torusGeometry args={[0.23, 0.015, 16, 32]} />
           <meshPhysicalMaterial color={color} roughness={0.9} sheen={0.2} />
        </mesh>
        {/* Sleeve Hollow */}
        <mesh position={[0, -0.28, 0]}>
           <cylinderGeometry args={[0.22, 0.22, 0.01, 32]} />
           <meshBasicMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  );
};

const ProceduralHoodie: React.FC<{ color: string; textureUrl: string | null; fit: FitType; textureScale: number }> = ({ color, textureUrl, fit, textureScale }) => {
  const groupRef = useRef<THREE.Group>(null);
  const baseScale = getFitScale(fit);
  const scale: [number, number, number] = [baseScale[0] * 1.1, baseScale[1], baseScale[2] * 1.1];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={scale}>
      {/* Main Body */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.52, 1.5, 32]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Shoulders */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.52, 0.48, 0.3, 32]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Arms - Long */}
      <mesh position={[-0.65, 0.2, 0]} rotation={[0, 0, Math.PI / 2.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.22, 1.2, 32]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      <mesh position={[0.65, 0.2, 0]} rotation={[0, 0, -Math.PI / 2.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.22, 1.2, 32]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 0.65, -0.2]} rotation={[0.4, 0, 0]} castShadow receiveShadow>
         <sphereGeometry args={[0.38, 32, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
         <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Pocket */}
      <mesh position={[0, -0.3, 0.48]} rotation={[0, 0, 0]} castShadow>
         <boxGeometry args={[0.5, 0.3, 0.1]} />
         <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
    </group>
  );
};

const ProceduralDress: React.FC<{ color: string; textureUrl: string | null; fit: FitType; textureScale: number }> = ({ color, textureUrl, fit, textureScale }) => {
  const groupRef = useRef<THREE.Group>(null);
  const scale = getFitScale(fit);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.40, 0.35, 0.8, 32]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.8, 1.4, 32]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      <mesh position={[-0.42, 0.85, 0]} rotation={[0, 0, Math.PI / 3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 32]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      <mesh position={[0.42, 0.85, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 32]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
    </group>
  );
};

// --- MAIN COMPONENT ---
// Forward ref used to expose the canvas element for screenshotting
export const ThreeDViewer = forwardRef<HTMLCanvasElement, ThreeDViewerProps>(
  ({ color, textureUrl, garmentType, fit, textureScale, customModelUrl }, ref) => {
  
  const renderGarment = () => {
    if (customModelUrl) {
      return (
        <React.Suspense fallback={null}>
          <CustomGLBModel 
            url={customModelUrl} 
            color={color} 
            textureUrl={textureUrl}
            textureScale={textureScale} 
          />
        </React.Suspense>
      );
    }

    switch (garmentType) {
      case GarmentType.HOODIE:
        return <ProceduralHoodie color={color} textureUrl={textureUrl} fit={fit} textureScale={textureScale} />;
      case GarmentType.DRESS:
        return <ProceduralDress color={color} textureUrl={textureUrl} fit={fit} textureScale={textureScale} />;
      case GarmentType.TSHIRT:
      default:
        return <MockupTShirt color={color} textureUrl={textureUrl} fit={fit} textureScale={textureScale} />;
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm border border-gray-100">
          Model: {customModelUrl ? 'Custom Upload' : garmentType}
        </div>
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-500 shadow-sm border border-gray-100">
          Fit: {fit}
        </div>
      </div>
      
      {/* preserveDrawingBuffer=true is REQUIRED for canvas.toDataURL() to work for screenshots */}
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        gl={{ 
          preserveDrawingBuffer: true, 
          antialias: false,
          // Updated for Three.js r160+
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping
        }} 
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        onCreated={({ gl }) => {
           // Attach the canvas element to the forwarded ref
           if (typeof ref === 'function') {
             ref(gl.domElement);
           } else if (ref) {
             ref.current = gl.domElement;
           }
        }}
      >
        <React.Suspense fallback={null}>
          {/* HDRI Environment for realistic reflections */}
          <Environment preset="city" />
          
          <Center top>
            {renderGarment()}
          </Center>

          {/* Contact Shadows for grounding the object */}
          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />
        </React.Suspense>
        
        {/* Post-Processing Effects */}
        <EffectComposer multisampling={0}>
           <SSAO 
             radius={0.15}
             intensity={12}
             luminanceInfluence={0.5}
             color={new THREE.Color("black")}
           />
        </EffectComposer>

        {/* Controls */}
        <OrbitControls autoRotate={false} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
      
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-gray-400 pointer-events-none">
        3D Mockup Viewer • PBR & AO
      </div>
    </div>
  );
});

export default ThreeDViewer;