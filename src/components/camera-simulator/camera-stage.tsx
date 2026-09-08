"use client";

import { ContactShadows, Edges, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, MathUtils, Mesh, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { CameraControl, CameraControlId, CameraView } from "@/data/camera-controls";

const viewPositions: Record<CameraView, [number, number, number]> = {
  perspective: [6.2, 3.8, 7.2],
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

function Material({ color = "#262c30", metalness = 0.42, roughness = 0.43 }: { color?: string; metalness?: number; roughness?: number }) {
  return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />;
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
      <sphereGeometry args={[0.16, 22, 22]} />
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
  const group = useRef<Group>(null);

  return (
    <group ref={group} rotation={[0, -0.06, 0]}>
      <RoundedBox args={[3.8, 2.35, 1.48]} radius={0.24} smoothness={5} castShadow receiveShadow>
        <Material />
        <Edges threshold={22} color="#596269" />
      </RoundedBox>
      <RoundedBox args={[1.18, 2.58, 1.68]} radius={0.28} smoothness={5} position={[1.47, -0.08, 0.1]} castShadow>
        <Material color="#171b1e" roughness={0.56} />
        <Edges threshold={22} color="#4a5258" />
      </RoundedBox>
      <RoundedBox args={[1.35, 0.72, 1.42]} radius={0.18} smoothness={4} position={[0, 1.13, -0.02]} castShadow>
        <Material color="#202529" />
        <Edges threshold={22} color="#596269" />
      </RoundedBox>

      <mesh position={[0, 0, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.045, 12, 64]} />
        <meshStandardMaterial color="#b8282d" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[1.18, 1.28, 0.78, 48]} />
        <Material color="#171b1e" metalness={0.62} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 1.72]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.92, 1.08, 0.82, 48]} />
        <Material color="#252b2f" metalness={0.54} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0, 1.85]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.91, 0.025, 10, 64]} />
        <meshStandardMaterial color="#a9b3b9" metalness={0.82} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 2.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.76, 0.84, 0.2, 48]} />
        <meshStandardMaterial color="#07090a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 2.3]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.64, 48]} />
        <meshPhysicalMaterial color="#18343f" metalness={0.4} roughness={0.08} transmission={0.18} clearcoat={1} />
      </mesh>

      <RoundedBox args={[2.15, 1.55, 0.08]} radius={0.08} smoothness={4} position={[-0.42, -0.07, -0.78]}>
        <meshPhysicalMaterial color="#18303a" metalness={0.22} roughness={0.18} clearcoat={0.8} />
        <Edges threshold={18} color="#7d898f" />
      </RoundedBox>
      <RoundedBox args={[1.15, 0.52, 0.24]} radius={0.1} smoothness={4} position={[0, 1.19, -0.7]}>
        <Material color="#090b0c" roughness={0.34} />
      </RoundedBox>
      <mesh position={[0, 1.18, -0.86]}>
        <circleGeometry args={[0.23, 32]} />
        <meshStandardMaterial color="#111a1d" />
      </mesh>

      <mesh position={[-1.24, 1.23, -0.1]} castShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.24, 24]} />
        <Material color="#30363a" metalness={0.62} roughness={0.3} />
      </mesh>
      <mesh position={[0.82, 1.22, 0.42]} castShadow>
        <cylinderGeometry args={[0.37, 0.37, 0.22, 24]} />
        <Material color="#111517" metalness={0.68} roughness={0.32} />
      </mesh>
      <mesh position={[1.57, 1.08, 0.66]} rotation={[-0.18, 0, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.27, 0.16, 28]} />
        <Material color="#3b4247" metalness={0.68} roughness={0.22} />
      </mesh>

      <mesh position={[1.57, 1.17, 0.67]} rotation={[-Math.PI / 2 - 0.18, 0, 0]}>
        <circleGeometry args={[0.13, 24]} />
        <meshStandardMaterial color="#d9dcdd" roughness={0.35} />
      </mesh>

      <mesh position={[0.82, 0.42, -0.8]}>
        <cylinderGeometry args={[0.17, 0.14, 0.22, 24]} />
        <Material color="#252b2f" roughness={0.34} />
      </mesh>
      <mesh position={[0.34, -0.34, -0.82]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.37, 0.08, 16, 36]} />
        <Material color="#20262a" metalness={0.4} roughness={0.42} />
      </mesh>

      <mesh position={[-1.66, -0.26, 0.75]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.16, 0.36, 8, 18]} />
        <Material color="#272d31" roughness={0.4} />
      </mesh>

      {controls.map((control) => (
        <ControlHotspot key={control.id} control={control} active={activeId === control.id} onSelect={onSelect} />
      ))}
    </group>
  );
}

export function CameraStage({ controls, activeId, view, onSelect }: { controls: CameraControl[]; activeId: CameraControlId; view: CameraView; onSelect: (id: CameraControlId) => void }) {
  return (
    <Canvas dpr={[1, 1.6]} shadows camera={{ position: viewPositions.perspective, fov: 34, near: 0.1, far: 100 }} gl={{ antialias: true, alpha: false }}>
      <color attach="background" args={["#d9dee1"]} />
      <fog attach="fog" args={["#d9dee1", 12, 24]} />
      <hemisphereLight args={["#ffffff", "#78838a", 2.1]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[6, 8, 7]} intensity={3.4} color="#fff5d8" castShadow />
      <directionalLight position={[-7, 4, -5]} intensity={2.2} color="#bdefff" />
      <pointLight position={[4, -2, 5]} intensity={10} color="#f0b323" distance={12} />
      <CameraBody controls={controls} activeId={activeId} onSelect={onSelect} />
      <ContactShadows position={[0, -1.55, 0]} opacity={0.35} scale={10} blur={3.4} far={5.5} color="#263036" />
      <gridHelper args={[18, 28, "#aab3b8", "#c7cdd0"]} position={[0, -1.54, 0]} />
      <CameraRig view={view} />
    </Canvas>
  );
}
