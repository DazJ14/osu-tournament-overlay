import { reactive, watch } from "vue";
import { useEngine } from "../core/engine";
import { useDebug } from "./useDebug";

const gameState = reactive({
  scoreVisible: false,
  starsVisible: false,
});

let isInitialized = false;

export function useGameState() {
  const engine = useEngine();
  const { debugState } = useDebug();

  if (!isInitialized) {
    engine.register("tourney.manager.bools.scoreVisible", (_, val) => {
      if (!debugState.testMode) gameState.scoreVisible = val;
    });
    engine.register("tourney.manager.bools.starsVisible", (_, val) => {
      if (!debugState.testMode) gameState.starsVisible = val;
    });
    isInitialized = true;
  }

  // Sincroniza el estado del juego con el modo debug
  watch([() => debugState.testMode, () => debugState.scoreVisible, () => debugState.starsVisible], () => {
    if (debugState.testMode) {
      gameState.scoreVisible = debugState.scoreVisible;
      gameState.starsVisible = debugState.starsVisible;
    } else {
      // desactivar modo debug, restaurar estado real del juego
      gameState.scoreVisible = engine.cache?.tourney?.manager?.bools?.scoreVisible ?? false;
      gameState.starsVisible = engine.cache?.tourney?.manager?.bools?.starsVisible ?? false;
    }
  }, { immediate: true });

  return { gameState };
}