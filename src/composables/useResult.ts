import { reactive } from 'vue';
import { useEngine } from '../core/engine';
import { useDebug } from './useDebug';

const resultState = reactive({
  isEnded: false
});

let isInitialized = false;

export function useResult() {
  const engine = useEngine();
  const { debugState } = useDebug();

  if (!isInitialized) {
    engine.register("menu.bm.time.current", (_, value, data) => {
      if (debugState.testMode) return;
      
      // comprueba que el tiempo actual supera la duracion del mapa y que el marcador de puntuación está visible para determinar si el resultado se ha mostrado
      const fullTime = data.menu?.bm?.time?.full ?? 0;
      const isScoreVisible = data.tourney?.manager?.bools?.scoreVisible ?? false;
      
      resultState.isEnded = (value > fullTime) && isScoreVisible;
    });
    
    isInitialized = true;
  }

  return { resultState };
}