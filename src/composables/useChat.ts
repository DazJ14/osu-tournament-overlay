import { reactive } from "vue";
import { useEngine } from "../core/engine";
import { useDebug } from "./useDebug";

export interface ChatMessage {
  team: string;
  time: string;
  name: string;
  messageBody: string;
}

const chatState = reactive({
  messages: [] as ChatMessage[]
});

let isInitialized = false;

export function useChat() {
  const engine = useEngine();
  const { debugState } = useDebug();

  if (!isInitialized) {
    engine.register("tourney.manager.chat.length", (_, __, data) => {
      if (debugState.testMode) return;
      chatState.messages = [...data.tourney.manager.chat];
    });
    isInitialized = true;
  }

  return { chatState };
}