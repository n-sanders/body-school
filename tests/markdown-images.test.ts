import { describe, expect, it } from "vitest";
import { markdownImageUrls } from "../src/content/markdown-images";

describe("lesson-body image validation", () => {
  it("includes teaching figures that are absent from frontmatter", () => {
    expect(markdownImageUrls('![Gas exchange](images/servier/gas-exchange.png)\n\n![Another](images/missing.svg "Example")'))
      .toEqual(["images/servier/gas-exchange.png", "images/missing.svg"]);
  });

  it("does not mistake source and credit links for images", () => {
    expect(markdownImageUrls('[Source](https://example.org/page) and [Credits](#/credits)')).toEqual([]);
  });
});
