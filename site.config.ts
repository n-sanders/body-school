/**
 * Everything that makes this site about one particular topic, apart from the
 * files in content/. Edit this file (and replace content/) to start a new topic.
 */
import type { Item } from "./src/content/schema.ts";

export interface Category {
  id: string;
  label: string;
}

export interface CatalogConfig {
  /** Turn off for courses with no items to recognize; lessons then use text questions only. */
  enabled: boolean;
  /** Offer image-name drills in addition to the reference guide. */
  practice?: boolean;
  /** What one catalog entry is called, in lower case ("rocket", "breed"). */
  singular: string;
  plural: string;
  /** Label for the category field ("Group", "Family"). */
  categoryLabel: string;
  categories: Category[];
  /** Extra per-item fields shown as chips, in this order. Items may only use these keys. */
  attributes: Category[];
}

export type ImagesConfig =
  | { provider: "pinned" }
  | {
      /** Practice and Review fetch a fresh photo list per item, falling back to pinned photos. */
      provider: "live";
      fetchList: (item: Item) => Promise<string[]>;
    };

export interface SiteConfig {
  name: string;
  /** Lower-case, used for the progress storage key and backup file names. */
  slug: string;
  emoji: string;
  /** Home page heading and browser tab subtitle. */
  tagline: string;
  /** Home page intro paragraph. */
  description: string;
  /** Footer text, as Markdown. */
  footer: string;
  catalog: CatalogConfig;
  images: ImagesConfig;
  /** Short credit shown under each photo. */
  imageCredit: (url: string) => string;
}

const config: SiteConfig = {
  name: "Body School",
  slug: "body-school",
  emoji: "🫀",
  tagline: "Explore how the human body is built and how its systems work together",
  description:
    "Explore the body's major organs and systems in short lessons designed for about 10 minutes. Build a middle-school foundation by explaining how parts work together, with an introduction and review in every unit.",
  footer:
    "Body School — a middle-school foundation in human anatomy and physiology. [Image credits](#/credits). Progress is saved only in this browser.",
  catalog: {
    enabled: true,
    practice: false,
    singular: "structure",
    plural: "structures",
    categoryLabel: "Body System",
    categories: [
      { id: "support", label: "Skeletal & Muscular" },
      { id: "circulation", label: "Circulatory & Respiratory" },
      { id: "fuel", label: "Digestive & Urinary" },
      { id: "control", label: "Nervous & Endocrine" },
      { id: "protection", label: "Integumentary & Immune" },
    ],
    attributes: [
      { id: "system", label: "System" },
      { id: "location", label: "Location" },
      { id: "role", label: "Main Job" },
    ],
  },
  images: { provider: "pinned" },
  imageCredit: (url) => url.startsWith("images/servier/")
    ? "Servier Medical Art · CC BY 4.0"
    : url.startsWith("images/") ? "Source and license in image credits" : new URL(url).hostname,
};

export default config;
