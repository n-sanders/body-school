/** Image destinations in the inline Markdown format used by lesson authors. */
export function markdownImageUrls(body: string): string[] {
  return [...body.matchAll(/!\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)].map((match) => match[1]);
}
