import { reactive } from "vue";
import { useEngine } from "../core/engine";

export enum PickAction {
  PICK_RED = 0,
  PICK_BLUE = 1,
  REMOVE_PICK = 2,
}

const beatmapState = reactive({
  artist: "",
  title: "",
  difficulty: "",
  mapper: "",
  cs: 0,
  ar: 0,
  od: 0,
  bpm: 0,
  sr: 0,
  length: 0,
  backgroundUrl: "",
  currentMapId: -1,
  redPickedMaps: new Set<number>(),
  bluePickedMaps: new Set<number>()
});

let isInitialized = false;

export function useBeatmap() {
  if (!isInitialized) {
    const engine = useEngine();

    engine.register("menu.bm.metadata.artist", (_, val) => beatmapState.artist = val);
    engine.register("menu.bm.metadata.title", (_, val) => beatmapState.title = val);
    engine.register("menu.bm.metadata.difficulty", (_, val) => beatmapState.difficulty = val);
    engine.register("menu.bm.metadata.mapper", (_, val) => beatmapState.mapper = val);
    
    engine.register("menu.bm.stats.CS", (_, val) => beatmapState.cs = val);
    engine.register("menu.bm.stats.AR", (_, val) => beatmapState.ar = val);
    engine.register("menu.bm.stats.OD", (_, val) => beatmapState.od = val);
    engine.register("menu.bm.stats.BPM.common", (_, val) => beatmapState.bpm = val);
    engine.register("menu.bm.stats.fullSR", (_, val) => beatmapState.sr = val);
    engine.register("menu.bm.time.full", (_, val) => beatmapState.length = val);
    
    engine.register("menu.bm.path.full", (_, val) => {
      beatmapState.backgroundUrl = `http://127.0.0.1:24050/Songs/${encodeURIComponent(val)}`;
    });
    
    engine.register("menu.bm.id", (_, val) => beatmapState.currentMapId = val);

    isInitialized = true;
  }

  const updatePickedMaps = (mapId: number, action: PickAction) => {
    switch (action) {
      case PickAction.REMOVE_PICK:
        beatmapState.redPickedMaps.delete(mapId);
        beatmapState.bluePickedMaps.delete(mapId);
        break;
      case PickAction.PICK_RED:
        beatmapState.redPickedMaps.add(mapId);
        beatmapState.bluePickedMaps.delete(mapId);
        break;
      case PickAction.PICK_BLUE:
        beatmapState.bluePickedMaps.add(mapId);
        beatmapState.redPickedMaps.delete(mapId);
        break;
    }
  };

  return { beatmapState, updatePickedMaps, PickAction };
}