"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  Float, 
  ContactShadows, 
  Environment, 
  MeshDistortMaterial,
  PresentationControls
} from "@react-three/drei";
import { motion as motion3d } from "framer-motion-3d";

interface DevicePreviewProps {
  type: "iphone" | "macbook" | "ipad";
}

const SmartphoneModel = () => (
  <mesh castShadow receiveShadow>
    <boxGeometry args={[1, 2, 0.1]} />
    <meshStandardMaterial color="#222" roughness={0.1} metalness={0.8} />
    {/* Screen */}
    <mesh position={[0, 0, 0.051]}>
      <planeGeometry args={[0.9, 1.9]} />
      <meshStandardMaterial color="#000" emissive="#111" />
    </mesh>
  </mesh>
);

const LaptopModel = () => (
  <group>
    {/* Screen */}
    <mesh position={[0, 0.5, 0]} rotation={[-0.2, 0, 0]}>
      <boxGeometry args={[2, 1.2, 0.05]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    {/* Base */}
    <mesh position={[0, -0.1, 0.6]}>
      <boxGeometry args={[2, 0.1, 1.4]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  </group>
);

const TabletModel = () => (
  <mesh castShadow receiveShadow>
    <boxGeometry args={[1.4, 1.8, 0.08]} />
    <meshStandardMaterial color="#111" roughness={0.2} />
  </mesh>
);

export default function DevicePreview({ type }: DevicePreviewProps) {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 35 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
        
        <Suspense fallback={null}>
          <PresentationControls
            global
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
              <group scale={1.2}>
                {type === "iphone" && <SmartphoneModel />}
                {type === "macbook" && <LaptopModel />}
                {type === "ipad" && <TabletModel />}
              </group>
            </Float>
          </PresentationControls>
          
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={4.5} 
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
