import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import credits from "../../IMAGE_CREDITS.md?raw";

export function CreditsPage() {
  return <article className="card prose"><Markdown remarkPlugins={[remarkGfm]}>{credits}</Markdown></article>;
}
