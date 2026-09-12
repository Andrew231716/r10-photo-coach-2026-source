"use client";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { CanvasTexture, DataTexture, RepeatWrapping, RGBAFormat, SRGBColorSpace } from "three";

type Position = [number, number, number];

function Mark({ text, position, rotation = [0, 0, 0], width = 0.5, height = 0.18 }: { text: string; position: Position; rotation?: Position; width?: number; height?: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#e5e7e8"; ctx.font = "bold 76px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 68);
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; return map;
  }, [text]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position} rotation={rotation}><planeGeometry args={[width, height]}/><meshBasicMaterial map={texture} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1}/></mesh>;
}

function Dial({ position, radius = 0.32, height = 0.15 }: { position: Position; radius?: number; height?: number }) {
  return <group position={position}><mesh castShadow><cylinderGeometry args={[radius, radius, height, 64]}/><meshStandardMaterial color="#141619" roughness={0.55} metalness={0.25}/></mesh>{Array.from({ length: 36 }, (_, i) => {
    const a = i * Math.PI * 2 / 36;
    return <mesh key={i} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]} rotation={[0, -a, 0]}><boxGeometry args={[0.027, height * 0.8, 0.028]}/><meshStandardMaterial color="#303236" roughness={0.65}/></mesh>;
  })}</group>;
}

function RearButton({ x, y, label, radius = 0.1 }: { x: number; y: number; label: string; radius?: number }) {
  return <group><mesh position={[x, y, -0.735]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[radius, radius, 0.07, 32]}/><meshStandardMaterial color="#24262a" roughness={0.65}/></mesh><Mark text={label} position={[x, y, -0.78]} rotation={[0, Math.PI, 0]} width={radius * 1.5} height={0.055}/></group>;
}

/** Original procedural teaching model, referenced against Canon's EOS R10 part diagrams. */
export function DetailedCamera() {
  const grain = useMemo(() => {
    const data = new Uint8Array(128 * 128 * 4);
    let seed = 71;
    for (let i = 0; i < data.length; i += 4) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const value = 90 + (seed % 130); data[i] = data[i + 1] = data[i + 2] = value; data[i + 3] = 255;
    }
    const map = new DataTexture(data, 128, 128, RGBAFormat); map.wrapS = map.wrapT = RepeatWrapping; map.repeat.set(5, 5); map.needsUpdate = true; return map;
  }, []);
  useEffect(() => () => grain.dispose(), [grain]);
  const shell = <meshStandardMaterial color="#202124" roughness={0.72} metalness={0.12} bumpMap={grain} bumpScale={0.009}/>;
  const rubber = <meshStandardMaterial color="#111214" roughness={0.95} bumpMap={grain} bumpScale={0.025}/>;
  return <group>
    <RoundedBox args={[3.65, 2.22, 1.25]} radius={0.2} smoothness={6} castShadow receiveShadow>{shell}</RoundedBox>
    <RoundedBox args={[1.02, 2.32, 1.91]} position={[-1.43, -0.05, 0.25]} radius={0.32} smoothness={6} castShadow>{rubber}</RoundedBox>
    <RoundedBox args={[0.98, 0.43, 1.75]} position={[-1.43, 0.98, 0.23]} rotation={[0, 0, -0.08]} radius={0.17} smoothness={5} castShadow>{shell}</RoundedBox>
    <RoundedBox args={[0.75, 1.38, 0.13]} position={[1.42, -0.21, 0.65]} radius={0.09} smoothness={4}>{rubber}</RoundedBox>
    <RoundedBox args={[0.6, 1.6, 0.14]} position={[-1.55, -0.06, -0.65]} radius={0.1} smoothness={4}>{rubber}</RoundedBox>
    {/* Sloping viewfinder housing and closed pop-up flash. */}
    <mesh position={[0.05, 1.17, 0]} castShadow><cylinderGeometry args={[0.5, 0.8, 0.65, 4]} /><meshStandardMaterial color="#242529" roughness={0.7}/></mesh>
    <RoundedBox args={[1.02, 0.18, 1.07]} position={[0.05, 1.52, 0.06]} radius={0.07} smoothness={4}>{shell}</RoundedBox>
    <RoundedBox args={[0.91, 0.35, 0.25]} position={[0.05, 1.25, 0.53]} radius={0.06} smoothness={4}>{shell}</RoundedBox>
    <Mark text="Canon" position={[0.05, 1.24, 0.664]} width={0.66} height={0.2}/>
    <Mark text="EOS" position={[1.38, 0.78, 0.65]} width={0.38} height={0.13}/>
    <Mark text="R10" position={[1.4, 0.6, 0.65]} width={0.38} height={0.13}/>
    {/* Multi-function shoe: rails and contact bed. */}
    <mesh position={[0.05, 1.64, -0.12]}><boxGeometry args={[0.49, 0.05, 0.57]}/><meshStandardMaterial color="#161719" metalness={0.5} roughness={0.45}/></mesh>
    {[-0.24, 0.34].map(x => <mesh key={x} position={[x, 1.68, -0.12]}><boxGeometry args={[0.06, 0.065, 0.58]}/><meshStandardMaterial color="#8b8e91" metalness={0.85} roughness={0.3}/></mesh>)}
    {/* RF mount and compact kit-style lens, concentric on the optical axis. */}
    <group position={[0.16, -0.07, 0]}>
      {[{ z: 0.69, r: 0.97, d: 0.14 }, { z: 0.95, r: 0.88, d: 0.42 }, { z: 1.25, r: 0.82, d: 0.22 }, { z: 1.53, r: 0.78, d: 0.36 }, { z: 1.79, r: 0.71, d: 0.2 }].map((ring, i) => <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[ring.r, ring.r, ring.d, 80]}/><meshStandardMaterial color={i % 2 ? "#1d1e21" : "#111214"} metalness={0.22} roughness={0.57}/></mesh>)}
      {[0.73, 1.05, 1.42, 1.69, 1.88].map((z, i) => <mesh key={z} position={[0, 0, z]}><torusGeometry args={[[0.965, 0.875, 0.785, 0.78, 0.69][i], 0.012, 8, 80]}/><meshStandardMaterial color={i === 0 ? "#91979a" : "#414247"} metalness={0.65} roughness={0.36}/></mesh>)}
      {Array.from({ length: 64 }, (_, i) => { const a = i * Math.PI / 32; return <mesh key={i} position={[Math.cos(a) * 0.788, Math.sin(a) * 0.788, 1.53]} rotation={[0, 0, a]}><boxGeometry args={[0.022, 0.025, 0.29]}/><meshStandardMaterial color="#35363a" roughness={0.7}/></mesh>; })}
      <mesh position={[0, 0, 1.897]}><ringGeometry args={[0.52, 0.69, 80]}/><meshStandardMaterial color="#090a0c" roughness={0.55}/></mesh>
      <mesh position={[0, 0, 1.898]}><circleGeometry args={[0.52, 80]}/><meshPhysicalMaterial color="#142d38" metalness={0.62} roughness={0.1} clearcoat={1}/></mesh>
      <mesh position={[0.09, 0.1, 1.905]} scale={[1, 0.3, 1]}><circleGeometry args={[0.24, 48]}/><meshBasicMaterial color="#678992" transparent opacity={0.16}/></mesh>
      <Mark text="RF-S 18-45mm" position={[0, -0.59, 1.909]} width={0.63} height={0.075}/>
      <mesh position={[0, 0.97, 0.78]}><boxGeometry args={[0.05, 0.08, 0.025]}/><meshStandardMaterial color="#eee"/></mesh>
    </group>
    {/* Mode dial, rear control dial, main dial and shutter all on the grip side. */}
    <Dial position={[-0.95, 1.18, -0.08]} radius={0.32}/>
    <Mark text="M Av Tv P" position={[-0.95, 1.261, -0.08]} rotation={[-Math.PI / 2, 0, 0]} width={0.49} height={0.16}/>
    <Dial position={[-1.53, 1.21, -0.45]} radius={0.24}/>
    <Dial position={[-1.52, 1.26, 0.46]} radius={0.21} height={0.1}/>
    <mesh position={[-1.53, 1.11, 0.93]} rotation={[0.28, 0, 0]} castShadow><cylinderGeometry args={[0.2, 0.24, 0.1, 48]}/><meshStandardMaterial color="#55585b" metalness={0.72} roughness={0.27}/></mesh>
    <mesh position={[-1.15, 1.22, 0.56]}><cylinderGeometry args={[0.07, 0.07, 0.06, 24]}/><meshStandardMaterial color="#962c2a"/></mesh>
    {/* Hinged LCD, eye cup, joystick and separate cross keys. */}
    <RoundedBox args={[2.42, 1.6, 0.14]} position={[0.42, -0.23, -0.69]} radius={0.08} smoothness={4}>{shell}</RoundedBox>
    <mesh position={[0.42, -0.18, -0.77]} rotation={[0, Math.PI, 0]}><planeGeometry args={[2.18, 1.35]}/><meshPhysicalMaterial color="#13212a" roughness={0.15} metalness={0.22} clearcoat={1}/></mesh>
    <Mark text="M   1/250   F5.6   ISO 400" position={[0.42, -0.69, -0.781]} rotation={[0, Math.PI, 0]} width={1.92} height={0.095}/>
    <Mark text="+  +  +" position={[0.42, -0.12, -0.782]} rotation={[0, Math.PI, 0]} width={0.78} height={0.16}/>
    <RoundedBox args={[0.13, 1.35, 0.18]} position={[1.69, -0.2, -0.7]} radius={0.04} smoothness={3}>{shell}</RoundedBox>
    <RoundedBox args={[1.08, 0.61, 0.32]} position={[0.05, 1.01, -0.68]} radius={0.14} smoothness={5}>{rubber}</RoundedBox>
    <mesh position={[0.05, 1.03, -0.849]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.54, 0.34]}/><meshPhysicalMaterial color="#172c30" metalness={0.6} roughness={0.12} clearcoat={1}/></mesh>
    <RearButton x={1.45} y={0.85} label="MENU" radius={0.13}/>
    <RearButton x={-1.08} y={0.88} label="AF-ON" radius={0.14}/>
    <RearButton x={-1.56} y={0.56} label="*"/>
    <RearButton x={-1.56} y={0.24} label="+"/>
    <RearButton x={-1.08} y={-0.13} label="INFO" radius={0.12}/>
    <RearButton x={-1.2} y={-0.91} label="▶"/>
    <mesh position={[-0.76, 0.64, -0.79]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.17, 0.2, 32]}/><meshStandardMaterial color="#18191c" roughness={0.9} bumpMap={grain} bumpScale={0.018}/></mesh>
    <mesh position={[-1.18, -0.51, -0.735]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.29, 0.29, 0.08, 48]}/><meshStandardMaterial color="#1a1b1e" roughness={0.68}/></mesh>
    <RearButton x={-1.18} y={-0.51} label="Q/SET" radius={0.12}/>
    <Mark text="ISO" position={[-1.18, -0.3, -0.785]} rotation={[0, Math.PI, 0]} width={0.17} height={0.06}/>
    {/* Front focus selector and lens release. */}
    <mesh position={[-0.87, -0.74, 0.74]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.16, 0.13, 32]}/><meshStandardMaterial color="#36373a" roughness={0.65}/></mesh>
    <Mark text="AF MF" position={[-0.88, -0.5, 0.77]} width={0.28} height={0.07}/>
    <RoundedBox args={[0.19, 0.42, 0.1]} position={[1.23, -0.1, 0.73]} radius={0.06} smoothness={4}>{shell}</RoundedBox>
    {[-1.85, 1.85].map(x => <mesh key={x} position={[x, 0.83, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.13, 0.035, 10, 24]}/><meshStandardMaterial color="#67696d" metalness={0.85} roughness={0.3}/></mesh>)}
    <RoundedBox args={[0.05, 1.05, 0.62]} position={[1.837, -0.13, -0.06]} radius={0.02} smoothness={3}>{rubber}</RoundedBox>
  </group>;
}
