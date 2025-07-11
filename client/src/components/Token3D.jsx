import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot } from '@react-three/drei';

const Token3D = () => {
  const modelRef = useRef();
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x += 0.001;
      modelRef.current.rotation.y += 0.003;
    }
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <TorusKnot ref={modelRef} args={[1, 0.3, 200, 22]}>
        <meshStandardMaterial color="#6c5ce7" metalness={0.8} roughness={0.1} />
      </TorusKnot>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

export default Token3D;