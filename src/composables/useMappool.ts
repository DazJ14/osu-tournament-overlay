import { ref, reactive } from 'vue';
import axios from 'axios';
import { useBeatmap, PickAction } from './useBeatmap';

export enum MapStatus { NIL = 0, PICKED = 1, BANNED = 2 }
export enum MapSide { NIL = 0, LEFT = 1, RIGHT = 2 }

export interface MapState {
  status: MapStatus;
  side: MapSide;
  realId: number;
}

const showMappool = ref(false);
const mappool = ref<any[]>([]); 
const mapStates = reactive<Record<string, MapState>>({});
let isInitialized = false;

export function useMappool() {
  const { updatePickedMaps } = useBeatmap();

  const initMappool = async () => {
    if (isInitialized) return;
    try {
      const { data: json } = await axios.get('./data.json');
      const mapIds: number[] = [];
      
      json.mappool.forEach((currMod: any) => mapIds.push(...currMod.maps));

      const query = new URLSearchParams();
      for (const id of mapIds) {
        query.append("ids", id.toString());
      }

      const { data: { beatmaps } } = await axios.get(`https://api.try-z.net/beatmaps?${query.toString()}`);
      
      mappool.value = json.mappool.map((modpool: any) => ({
        mod: modpool.mod,
        icon: modpool.icon,
        maps: modpool.maps.map((id: number, index: number) => {
          const beatmapData = beatmaps.find((b: any) => b.id === id);
          if (!beatmapData) return null;

          // Generamos un ID único: ej. "NM-12345-0"
          const uniqueId = `${modpool.mod}-${id}-${index}`;
          
          if (!mapStates[uniqueId]) {
            mapStates[uniqueId] = { status: MapStatus.NIL, side: MapSide.NIL, realId: id };
          }

          return {
            ...beatmapData,
            uniqueId
          };
        }).filter(Boolean)
      }));

      isInitialized = true;
    } catch (e) {
      console.error("Error cargando el Mappool:", e);
    }
  };

  const toggleMappool = () => showMappool.value = !showMappool.value;

  const handleMapClick = (uniqueId: string, event: MouseEvent) => {
    event.preventDefault();
    const { shiftKey, ctrlKey, type } = event;
    const state = mapStates[uniqueId];

    if (type === 'click') {
      if (shiftKey) { state.side = MapSide.LEFT; state.status = MapStatus.BANNED; }
      else if (ctrlKey) { state.side = MapSide.NIL; state.status = MapStatus.NIL; }
      else { state.side = MapSide.LEFT; state.status = MapStatus.PICKED; }
    } else if (type === 'contextmenu') {
      if (shiftKey) { state.side = MapSide.RIGHT; state.status = MapStatus.BANNED; }
      else if (ctrlKey) { state.side = MapSide.NIL; state.status = MapStatus.NIL; }
      else { state.side = MapSide.RIGHT; state.status = MapStatus.PICKED; }
    }

    if (state.status === MapStatus.PICKED) {
      updatePickedMaps(state.realId, state.side === MapSide.LEFT ? PickAction.PICK_RED : PickAction.PICK_BLUE);
    } else {
      updatePickedMaps(state.realId, PickAction.REMOVE_PICK);
    }
  };

  return { showMappool, mappool, mapStates, initMappool, toggleMappool, handleMapClick, MapStatus, MapSide };
}