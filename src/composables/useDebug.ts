// src/composables/useDebug.ts
import { reactive } from "vue";

// Estado global para el modo debug
const debugState = reactive({
  testMode: false,
  scoreVisible: false,
  starsVisible: false,
  scoreLeft: 0,
  scoreRight: 0,
});

export function useDebug() {
  return {
    debugState,
  };
}