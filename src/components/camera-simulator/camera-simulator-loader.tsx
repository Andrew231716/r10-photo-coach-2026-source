"use client";

import dynamic from "next/dynamic";

const CameraSimulator = dynamic(
  () => import("@/components/camera-simulator/camera-simulator").then((module) => module.CameraSimulator),
  {
    ssr: false,
    loading: () => <div className="grid min-h-[520px] place-items-center border border-[var(--line)] bg-[var(--panel)] font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Preparazione simulatore 3D…</div>,
  },
);

export function CameraSimulatorLoader() {
  return <CameraSimulator />;
}
