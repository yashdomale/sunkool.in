import {
  sceneAtProgress,
  buildNarrativeScenes,
  type NarrativeScene,
  type NarrativeSceneDef,
} from "./tech-demo-chapters";
import { SCRUB_START } from "./tech-demo-media";

const ZERO_PANES = { windshield: 0, side: 0, moonroof: 0, rear: 0 } as const;

type TempKeyframe = {
  progress: number;
  outside: number;
  cabin: number;
};

let cachedKeyframesScenes: NarrativeSceneDef[] | null = null;
let cachedKeyframes: TempKeyframe[] | null = null;

/** Memoized on `scenes` identity — buildNarrativeScenes returns a stable reference per (duration, mobile). */
function buildTempKeyframes(scenes: NarrativeSceneDef[]): TempKeyframe[] {
  if (cachedKeyframes && cachedKeyframesScenes === scenes) return cachedKeyframes;

  const assault = scenes.find((s) => s.id === "assault")!;
  const penetration = scenes.find((s) => s.id === "penetration")!;
  const protection = scenes.find((s) => s.id === "protection")!;
  const protectionSpan = protection.end - protection.start;
  const solutionPoint = protection.start;

  cachedKeyframesScenes = scenes;
  cachedKeyframes = [
    // Both climb together — similar readings before "Here's the solution"
    { progress: assault.start, outside: 48, cabin: 47 },
    { progress: assault.end, outside: 49, cabin: 48 },
    { progress: penetration.end, outside: 50, cabin: 50 },
    // After solution headline: exterior holds, cabin cools slowly
    { progress: solutionPoint + protectionSpan * 0.25, outside: 50, cabin: 41 },
    { progress: solutionPoint + protectionSpan * 0.5, outside: 50, cabin: 32 },
    { progress: solutionPoint + protectionSpan * 0.75, outside: 50, cabin: 26 },
    { progress: protection.end, outside: 50, cabin: 22 },
  ];
  return cachedKeyframes;
}

function tempsFromProgress(
  p: number,
  scenes: NarrativeSceneDef[]
): { outside: number; cabin: number } {
  const keyframes = buildTempKeyframes(scenes);
  const last = keyframes[keyframes.length - 1];

  if (p <= keyframes[0].progress) {
    return { outside: keyframes[0].outside, cabin: keyframes[0].cabin };
  }
  if (p >= last.progress) {
    return { outside: last.outside, cabin: last.cabin };
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (p >= a.progress && p < b.progress) {
      const t = (p - a.progress) / (b.progress - a.progress);
      return {
        outside: Math.round(a.outside + t * (b.outside - a.outside)),
        cabin: Math.round(a.cabin + t * (b.cabin - a.cabin)),
      };
    }
  }

  return { outside: last.outside, cabin: last.cabin };
}

export type TechDemoState = {
  progress: number;
  isMobile: boolean;
  scene: NarrativeScene;
  sceneLocal: number;
  cool: number;
  navVisible: boolean;
  hudVisible: boolean;
  outsideTemp: number;
  cabinTemp: number;
  /** Unused 3D-path stubs (kept for legacy WebGL modules). */
  heat: number;
  distortion: number;
  rayIntensity: number;
  nanoReveal: number;
  show3d: boolean;
  cameraT: number;
  orbitAngle: number;
  paneHits: typeof ZERO_PANES;
  filmApply: typeof ZERO_PANES;
};

export function createTechDemoState(): TechDemoState {
  return {
    progress: 0,
    isMobile: false,
    scene: "cold_open",
    sceneLocal: 0,
    cool: 0,
    navVisible: false,
    hudVisible: false,
    outsideTemp: 48,
    cabinTemp: 47,
    heat: 0,
    distortion: 0,
    rayIntensity: 0,
    nanoReveal: 0,
    show3d: false,
    cameraT: 0,
    orbitAngle: 0,
    paneHits: ZERO_PANES,
    filmApply: ZERO_PANES,
  };
}

export function updateTechDemoState(
  _state: TechDemoState,
  progress: number
): TechDemoState {
  const p = Math.min(1, Math.max(0, progress));
  const sceneOpts = { mobile: _state.isMobile };
  const scenes = buildNarrativeScenes(sceneOpts);
  const protectionStart = scenes.find((s) => s.id === "protection")!.start;
  const revealStart = scenes.find((s) => s.id === "reveal")!.start;
  const { outside, cabin } = tempsFromProgress(p, scenes);

  const { scene, local } = sceneAtProgress(p, sceneOpts);
  const id = scene.id;

  let cool = 0;
  if (id === "protection") cool = 0.35 + local * 0.65;
  else if (id === "reveal") cool = 1;

  return {
    progress: p,
    isMobile: _state.isMobile,
    scene: id,
    sceneLocal: local,
    cool,
    navVisible: p >= protectionStart,
    hudVisible: p >= SCRUB_START && p < revealStart,
    outsideTemp: outside,
    cabinTemp: cabin,
    heat: 0,
    distortion: 0,
    rayIntensity: 0,
    nanoReveal: 0,
    show3d: false,
    cameraT: 0,
    orbitAngle: 0,
    paneHits: ZERO_PANES,
    filmApply: ZERO_PANES,
  };
}

/** True when React UI should re-render for this state change. */
export function uiStateChanged(prev: TechDemoState, next: TechDemoState): boolean {
  return (
    prev.scene !== next.scene ||
    prev.hudVisible !== next.hudVisible ||
    prev.navVisible !== next.navVisible ||
    prev.outsideTemp !== next.outsideTemp ||
    prev.cabinTemp !== next.cabinTemp ||
    Math.abs(prev.cool - next.cool) > 0.04 ||
    // Cold-open copy swaps at 3.5% / 8% scroll.
    prev.progress < 0.035 !== next.progress < 0.035 ||
    prev.progress < SCRUB_START !== next.progress < SCRUB_START ||
    (next.scene === "protection" &&
      Math.abs(prev.sceneLocal - next.sceneLocal) > 0.03) ||
    (next.scene === "reveal" && Math.abs(prev.sceneLocal - next.sceneLocal) > 0.03)
  );
}
