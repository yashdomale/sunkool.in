import { SCRUB_END, SCRUB_START } from "./tech-demo-media";

export type NarrativeScene =
  | "cold_open"
  | "assault"
  | "penetration"
  | "protection"
  | "reveal";

export type NarrativeSceneDef = {
  id: NarrativeScene;
  start: number;
  end: number;
  /** One-line documentary caption during 3D (empty for cold_open) */
  caption: string;
};

export type NarrativeSceneOptions = {
  mobile?: boolean;
};

let cachedScenesKey: string | null = null;
let cachedScenes: NarrativeSceneDef[] | null = null;

/**
 * Scene boundaries across scroll progress — the frame sequence plays through
 * uninterrupted. Called on every scroll-driven progress update, so the
 * result is memoized on `mobile` — that only changes on viewport change.
 */
export function buildNarrativeScenes(
  options: NarrativeSceneOptions = {}
): NarrativeSceneDef[] {
  const { mobile = false } = options;
  const key = String(mobile);
  if (cachedScenes && cachedScenesKey === key) return cachedScenes;

  const scrubEnd = mobile ? 0.98 : SCRUB_END;
  const span = Math.max(0.001, scrubEnd - SCRUB_START);
  const assaultEnd = SCRUB_START + span * 0.28;
  const penetrationEnd = SCRUB_START + span * 0.55;
  const protectionEnd = SCRUB_START + span * 0.78;

  cachedScenesKey = key;
  cachedScenes = [
    { id: "cold_open", start: 0, end: SCRUB_START, caption: "" },
    {
      id: "assault",
      start: SCRUB_START,
      end: assaultEnd,
      caption: "Solar energy strikes untreated glass.",
    },
    {
      id: "penetration",
      start: assaultEnd,
      end: penetrationEnd,
      caption: "Heat floods the cabin.",
    },
    {
      id: "protection",
      start: penetrationEnd,
      end: protectionEnd,
      caption: "Infrared rejected. Cabin cooling.",
    },
    {
      id: "reveal",
      start: protectionEnd,
      end: 1,
      caption: "Protection you can see. Comfort you can feel.",
    },
  ];
  return cachedScenes;
}

export function sceneAtProgress(
  progress: number,
  options: NarrativeSceneOptions = {}
): {
  scene: NarrativeSceneDef;
  index: number;
  local: number;
} {
  const p = Math.min(1, Math.max(0, progress));
  const scenes = buildNarrativeScenes(options);
  const scene =
    scenes.find((s) => p >= s.start && p < s.end) ??
    scenes[scenes.length - 1];
  const index = scenes.indexOf(scene);
  const span = Math.max(0.001, scene.end - scene.start);
  const local = Math.min(1, Math.max(0, (p - scene.start) / span));
  return { scene, index, local };
}

/** @deprecated use sceneAtProgress */
export function chapterAtProgress(progress: number) {
  const { scene, index, local } = sceneAtProgress(progress);
  return {
    chapter: {
      id: scene.id,
      start: scene.start,
      end: scene.end,
      eyebrow: "",
      title: "",
      body: scene.caption,
      mode: "solar" as const,
    },
    index,
    local,
  };
}
