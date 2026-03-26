import { reactive } from "vue";
import { useEngine } from "../core/engine";

const teamState = reactive({
  nameLeft: "Team 1",
  nameRight: "Team 2",
  starsLeft: 0,
  starsRight: 0,
  bestOf: 1,
});

let isInitialized = false;

export function useTeam() {
  if (!isInitialized) {
    const engine = useEngine();

    engine.register("tourney.manager.teamName.left", (_, val) => teamState.nameLeft = val);
    engine.register("tourney.manager.teamName.right", (_, val) => teamState.nameRight = val);
    engine.register("tourney.manager.stars.left", (_, val) => teamState.starsLeft = val);
    engine.register("tourney.manager.stars.right", (_, val) => teamState.starsRight = val);
    engine.register("tourney.manager.bestOF", (_, val) => teamState.bestOf = val);

    isInitialized = true;
  }

  return { teamState };
}