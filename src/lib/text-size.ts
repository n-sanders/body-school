import { memoryStorage, type KeyValueStorage } from "./progress";
import { site } from "./site";

export const TEXT_SIZES = ["default", "large", "larger", "largest"] as const;
export type TextSize = (typeof TEXT_SIZES)[number];
export type TextSizeDirection = -1 | 1;

export const TEXT_SIZE_KEY = `${site.slug}.text-size`;

const textSizeSet = new Set<string>(TEXT_SIZES);

export function isTextSize(value: string | null): value is TextSize {
  return value !== null && textSizeSet.has(value);
}

export function readTextSize(storage: KeyValueStorage): TextSize {
  const raw = storage.getItem(TEXT_SIZE_KEY);
  return isTextSize(raw) ? raw : "default";
}

export function writeTextSize(storage: KeyValueStorage, size: TextSize): void {
  storage.setItem(TEXT_SIZE_KEY, size);
}

export function stepTextSize(size: TextSize, direction: TextSizeDirection): TextSize {
  const index = TEXT_SIZES.indexOf(size);
  const next = Math.min(TEXT_SIZES.length - 1, Math.max(0, index + direction));
  return TEXT_SIZES[next];
}

export interface TextSizeTarget {
  dataset: { textSize?: string };
}

export function applyTextSize(size: TextSize, root: TextSizeTarget = document.documentElement): void {
  if (size === "default") delete root.dataset.textSize;
  else root.dataset.textSize = size;
}

type Listener = () => void;

class TextSizeStore {
  private size: TextSize;
  private listeners = new Set<Listener>();

  constructor(private storage: KeyValueStorage) {
    this.size = readTextSize(storage);
  }

  getSnapshot = (): TextSize => this.size;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  set(size: TextSize): void {
    if (size === this.size) return;
    this.size = size;
    writeTextSize(this.storage, size);
    applyTextSize(size);
    for (const listener of this.listeners) listener();
  }
}

function browserStorage(): KeyValueStorage {
  try {
    const probe = `__${site.slug}_text_size_probe__`;
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return memoryStorage();
  }
}

let browserStore: TextSizeStore | undefined;

export function getTextSizeStore(): TextSizeStore {
  browserStore ??= new TextSizeStore(browserStorage());
  return browserStore;
}
