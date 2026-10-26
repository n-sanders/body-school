import { useSyncExternalStore } from "react";
import { getTextSizeStore } from "../lib/text-size";

export function useTextSize() {
  const store = getTextSizeStore();
  const size = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return { size, store };
}
