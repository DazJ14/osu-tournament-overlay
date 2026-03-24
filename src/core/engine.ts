import ZEngine from "@fukutotojido/z-engine";

const engine = new ZEngine("ws://127.0.0.1:24050/ws");

export function useEngine() {
  return engine;
}