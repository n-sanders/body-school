import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const illustratedComponents: Components = {
  p({ node, children }) {
    const isFigure = node?.children.some((child) => child.type === "element" && child.tagName === "img")
      && node.children.every((child) =>
        child.type === "element" ? child.tagName === "img" : child.type === "text" && !child.value.trim(),
      );
    return isFigure ? <figure className="lesson-figure">{children}</figure> : <p>{children}</p>;
  },
  img({ src, alt, title }) {
    return (
      <>
        <a className="lesson-figure-link" href={src} target="_blank" rel="noreferrer" aria-label={`Open full-size illustration: ${alt}`}>
          <img src={src} alt={alt} width="1536" height="1024" loading="lazy" decoding="async" />
        </a>
        <figcaption>{title} <a href={src} target="_blank" rel="noreferrer">View full size ↗</a></figcaption>
      </>
    );
  },
};

export function LessonReading({ body }: { body: string }) {
  // Illustrated lessons use level-two headings to separate their reading panels.
  // Keep the original Markdown rendering for lessons without this structure.
  if (!body.includes("![") || !/^## /m.test(body)) {
    return <section className="card prose"><Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown></section>;
  }

  const sections = body.trim().split(/\n(?=## )/);
  return (
    <div className="lesson-reading">
      {sections.map((section, index) => (
        <section className={`card prose lesson-panel lesson-panel-${index + 1}`} key={index}>
          <Markdown remarkPlugins={[remarkGfm]} components={illustratedComponents}>{section}</Markdown>
        </section>
      ))}
    </div>
  );
}
