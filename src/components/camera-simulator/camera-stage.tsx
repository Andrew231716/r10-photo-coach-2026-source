"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, Mesh, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { CameraControl, CameraControlId, CameraView } from "@/data/camera-controls";

import { DetailedCamera } from "./detailed-camera";

const viewPositions: Record<CameraView, [number, number, number]> = {
  perspective: [-6.2, 3.8, 7.2],
  front: [0, 0.25, 9.5],
  rear: [0, 0.25, -9.5],
  left: [-9.5, 0.25, 0],
  right: [9.5, 0.25, 0],
  top: [0, 9.5, 0.01],
};

const sceneOrigin = new Vector3(0, 0, 0);

function CameraRig({ view }: { view: CameraView }) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const destination = useRef(new Vector3(...viewPositions[view]));
  const animating = useRef(true);

  useEffect(() => {
    destination.current.set(...viewPositions[view]);
    animating.current = true;
    camera.up.set(0, 1, 0);
    if (view === "top") camera.up.set(0, 0, -1);
  }, [camera, view]);

  useFrame(() => {
    if (!animating.current) return;
    camera.position.lerp(destination.current, 0.09);
    if (camera.position.distanceTo(destination.current) < 0.02) {
      camera.position.copy(destination.current);
      animating.current = false;
    }
    controls.current?.target.lerp(sceneOrigin, 0.12);
    controls.current?.update();
  });

  return <OrbitControls ref={controls} enablePan={false} minDistance={5.5} maxDistance={13} rotateSpeed={0.7} zoomSpeed={0.75} />;
}

function ControlHotspot({ control, active, onSelect }: { control: CameraControl; active: boolean; onSelect: (id: CameraControlId) => void }) {
  const marker = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!marker.current) return;
    const target = active ? 1 + Math.sin(clock.elapsedTime * 4.5) * 0.12 : 0.72;
    marker.current.scale.setScalar(MathUtils.lerp(marker.current.scale.x, target, 0.12));
  });

  const handlePointer = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onSelect(control.id);
  };

  return (
    <mesh
      ref={marker}
      position={control.position}
      onClick={handlePointer}
      onPointerOver={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "default"; }}
    >
      <sphereGeometry args={[0.105, 18, 18]} />
      <meshStandardMaterial
        color={active ? "#ffd157" : "#55d4c6"}
        emissive={active ? "#f0b323" : "#173e3a"}
        emissiveIntensity={active ? 1.7 : 0.7}
        transparent
        opacity={active ? 1 : 0.82}
      />
    </mesh>
  );
}

function CameraBody({ controls, activeId, onSelect }: { controls: CameraControl[]; activeId: CameraControlId; onSelect: (id: CameraControlId) => void }) {
  return <group><DetailedCamera />{controls.map(control => <ControlHotspot key={control.id} control={control} active={activeId === control.id} onSelect={onSelect}/>)}</group>;
}

export function CameraStage({ controls, activeId, view, onSelect }: { controls: CameraControl[]; activeId: CameraControlId; view: CameraView; onSelect: (id: CameraControlId) => void }) {
  return (
    <Canvas dpr={[1, 1.6]} shadows camera={{ position: viewPositions.perspective, fov: 34, near: 0.1, far: 100 }} gl={{ antialias: true, alpha: true }}>
      <fog attach="fog" args={["#cbd3d7", 13, 25]} />
      <hemisphereLight args={["#ffffff", "#66747b", 1.3]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 8, 7]} intensity={2.8} color="#fff3cf" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-7, 4, -5]} intensity={1.6} color="#b8f5ef" />
      <spotLight position={[0, 7, -7]} intensity={4.5} angle={0.6} penumbra={0.8} color="#ffffff" />
      <pointLight position={[4, -2, 5]} intensity={3} color="#f0b323" distance={12} />
      <CameraBody controls={controls} activeId={activeId} onSelect={onSelect} />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.48} scale={10} blur={3.1} far={5.5} color="#263036" />
      <gridHelper args={[18, 28, "#87969d", "#b2bdc2"]} position={[0, -1.54, 0]} />
      <CameraRig view={view} />
    </Canvas>
  );
}
