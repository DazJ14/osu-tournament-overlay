import { reactive, watch } from "vue";
import { useEngine } from "../core/engine";
import { useDebug } from "./useDebug";
import IPCClient from "../handler/IPCClient";

export enum ScoringCondition {
  SCORE = "score",
  ACCURACY = "acc",
  MAX_COMBO = "combo",
  MISS_COUNT = "miss",
}

const scoreState = reactive({
  left: 0,
  right: 0,
  difference: 0,
  isLeftLeading: false,
  isRightLeading: false,
  lineDiffFactor: 0,
  condition: ScoringCondition.SCORE,
  maxObjects: 0,
});

let clients: IPCClient[] = [];
let isInitialized = false;

export function useScore() {
  const engine = useEngine();
  const { debugState } = useDebug();

  if (!isInitialized) {
    engine.register("tourney.manager.gameplay.score.left", (_, __, data) => updateScores(data));
    engine.register("tourney.manager.gameplay.score.right", (_, __, data) => updateScores(data));
    
    engine.register("tourney.ipcClients.length", (_, newValue) => {
      clients.forEach(c => c.destruct());
      clients = [...Array(newValue)].map((_, idx) => new IPCClient(engine, idx));
    });

    engine.register_jq(".menu?.bm?.stats?.circles + .menu?.bm?.stats?.sliders", (_, newValue) => {
      scoreState.maxObjects = newValue;
    });

    isInitialized = true;
  }

  function getLineDiffFactor(difference: number, left: number, right: number) {
    switch (scoreState.condition) {
      case ScoringCondition.SCORE: return Math.min(0.4, (Math.abs(difference) / 1500000) ** 0.5 / 2);
      case ScoringCondition.ACCURACY: return Math.min(0.4, (Math.abs(difference) / 1) ** 0.5 / 2);
      case ScoringCondition.MAX_COMBO: return Math.min(0.4, (Math.abs(difference) / Math.max(1, engine.cache?.menu?.bm?.stats?.maxCombo ?? 1)) ** 0.5 / 2);
      case ScoringCondition.MISS_COUNT: return Math.min(0.6, Math.abs(difference) / (left + right || 1));
    }
    return 0;
  }

  // Para debug: permite establecer manualmente los scores desde el DebugPanel
  function setManualScores(left: number, right: number) {
    const difference = left - right;
    scoreState.left = left;
    scoreState.right = right;
    scoreState.difference = Math.abs(difference);
    scoreState.lineDiffFactor = getLineDiffFactor(difference, left, right);
    scoreState.isLeftLeading = difference > 0 === (scoreState.condition !== ScoringCondition.MISS_COUNT);
    scoreState.isRightLeading = difference < 0 === (scoreState.condition !== ScoringCondition.MISS_COUNT);
  }

  function updateScores(data: any) {
    if (debugState.testMode) return;

    let scoringLeft = 0;
    let scoringRight = 0;

    switch (scoreState.condition) {
      case ScoringCondition.SCORE:
        scoringLeft = data.tourney.manager.gameplay.score.left;
        scoringRight = data.tourney.manager.gameplay.score.right;
        break;
      case ScoringCondition.ACCURACY:
        scoringLeft = clients.filter((c) => c.team === "left").reduce((acc, curr, _, arr) => acc + curr.accuracy / arr.length, 0);
        scoringRight = clients.filter((c) => c.team === "right").reduce((acc, curr, _, arr) => acc + curr.accuracy / arr.length, 0);
        break;
      case ScoringCondition.MAX_COMBO:
        scoringLeft = Math.max(0, ...clients.filter((c) => c.team === "left").map((c) => c.maxCombo));
        scoringRight = Math.max(0, ...clients.filter((c) => c.team === "right").map((c) => c.maxCombo));
        break;
      case ScoringCondition.MISS_COUNT:
        scoringLeft = clients.filter((c) => c.team === "left").reduce((acc, curr) => acc + curr.h0, 0);
        scoringRight = clients.filter((c) => c.team === "right").reduce((acc, curr) => acc + curr.h0, 0);
        break;
    }

    setManualScores(scoringLeft, scoringRight);
  }

  // Conectamos el DebugPanel con el estado del score
  watch([() => debugState.scoreLeft, () => debugState.scoreRight, () => debugState.testMode], () => {
    if (debugState.testMode) {
      setManualScores(debugState.scoreLeft, debugState.scoreRight);
    }
  }, { immediate: true });

  return { scoreState, ScoringCondition };
}