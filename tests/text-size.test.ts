import { describe, expect, it } from "vitest";
import { memoryStorage } from "../src/lib/progress";
import {
  TEXT_SIZE_KEY,
  TEXT_SIZES,
  applyTextSize,
  readTextSize,
  stepTextSize,
  writeTextSize,
  type TextSize,
  type TextSizeTarget,
} from "../src/lib/text-size";

const target = (): TextSizeTarget => ({ dataset: {} });

describe("text size", () => {
  it("falls back to default for missing or unknown values", () => {
    const storage = memoryStorage();
    expect(readTextSize(storage)).toBe("default");
    storage.setItem(TEXT_SIZE_KEY, "huge");
    expect(readTextSize(storage)).toBe("default");
    storage.setItem(TEXT_SIZE_KEY, "");
    expect(readTextSize(storage)).toBe("default");
  });

  it("round-trips every stored step", () => {
    const storage = memoryStorage();
    for (const size of TEXT_SIZES) {
      writeTextSize(storage, size);
      expect(storage.getItem(TEXT_SIZE_KEY)).toBe(size);
      expect(readTextSize(storage)).toBe(size);
    }
  });

  it("clamps steps at both ends", () => {
    let size: TextSize = "default";
    const seen: TextSize[] = [size];
    while (size !== "largest") {
      const next = stepTextSize(size, 1);
      expect(next).not.toBe(size);
      size = next;
      seen.push(size);
    }
    expect(seen).toEqual(["default", "large", "larger", "largest"]);
    expect(stepTextSize("largest", 1)).toBe("largest");

    while (size !== "default") size = stepTextSize(size, -1);
    expect(size).toBe("default");
    expect(stepTextSize("default", -1)).toBe("default");
  });

  it("applies the size as a data attribute and clears the default", () => {
    const root = target();
    applyTextSize("large", root);
    expect(root.dataset.textSize).toBe("large");
    applyTextSize("largest", root);
    expect(root.dataset.textSize).toBe("largest");
    applyTextSize("default", root);
    expect(root.dataset.textSize).toBeUndefined();
  });
});
