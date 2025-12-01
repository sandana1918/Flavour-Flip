import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, Sphere, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

const FloatingPot = ({ hovered, ...props }) => {
  const group = useRef();
  const lidRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) / 8;
    group.current.rotation.z = Math.sin(t / 4) / 20;
    group.current.position.y = Math.sin(t / 1.5) / 10;

    // Lid Animation
    const targetRotation = hovered ? -0.8 : 0.1;
    const targetY = hovered ? 2 : 1.2;
    const targetZ = hovered ? -0.5 : 0;

    lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, targetRotation, 0.1);
    lidRef.current.position.y = THREE.MathUtils.lerp(lidRef.current.position.y, targetY, 0.1);
    lidRef.current.position.z = THREE.MathUtils.lerp(lidRef.current.position.z, targetZ, 0.1);
  });

  return (
    <group ref={group} {...props}>
      {/* Pot Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.2, 2, 32]} />
        <meshStandardMaterial color="#a18072" roughness={0.3} metalness={0.4} />
      </mesh>


      {/* Lid (slightly floating) */}
      <group ref={lidRef} position={[0, 1.2, 0]} rotation={[0.1, 0, 0.1]}>
        <mesh>
          <cylinderGeometry args={[1.4, 1.6, 0.3, 32]} />
          <meshStandardMaterial color="#a18072" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#43302b" />
        </mesh>
      </group>
    </group>
  );
};

const FloatingVeg = ({ position, color, geometry, scale = 1, speed = 1, hovered }) => {
  const mesh = useRef();
  const initialPos = useRef(new THREE.Vector3(...position));

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;

    // Rotation always happens
    mesh.current.rotation.x = t;
    mesh.current.rotation.y = t * 0.5;

    // Position Logic
    if (hovered) {
      // Suck into pot (0, 0.5, 0)
      mesh.current.position.lerp(new THREE.Vector3(0, 0.5, 0), 0.02);
      mesh.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.02); // Shrink as they enter
    } else {
      // Return to original floating position
      const floatY = initialPos.current.y + Math.sin(t) * 0.2;
      const targetPos = new THREE.Vector3(initialPos.current.x, floatY, initialPos.current.z);
      mesh.current.position.lerp(targetPos, 0.05);
      mesh.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.05);
    }
  });

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      {geometry === 'sphere' && <sphereGeometry args={[0.4, 32, 32]} />}
      {geometry === 'box' && <boxGeometry args={[0.6, 0.6, 0.6]} />}
      {geometry === 'cone' && <coneGeometry args={[0.4, 0.8, 32]} />}
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  );
};

const HeroScene = () => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="w-full h-[500px] md:h-[600px] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, -10]} intensity={0.5} />

        <Environment preset="city" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <FloatingPot position={[0, -0.5, 0]} hovered={hovered} />
        </Float>

        {/* Floating Ingredients */}
        <FloatingVeg position={[-2.5, 1, 1]} color="#ff6b6b" geometry="sphere" speed={0.8} hovered={hovered} />
        <FloatingVeg position={[2.5, 0, -1]} color="#98c379" geometry="sphere" scale={0.8} speed={1.2} hovered={hovered} />
        <FloatingVeg position={[2, 2, 0]} color="#e5c07b" geometry="box" scale={0.6} speed={0.6} hovered={hovered} />
        <FloatingVeg position={[-2, -1.5, 2]} color="#61afef" geometry="cone" scale={0.7} speed={0.9} hovered={hovered} />

        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
};

export default HeroScene;
