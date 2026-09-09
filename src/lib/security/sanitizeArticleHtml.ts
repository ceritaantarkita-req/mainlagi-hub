import sanitizeHtml from "sanitize-html";

const ARTICLE_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "hr",
  "code",
  "pre"
] as const;

/**
 * Sanitize the HTML produced by the owner article editor.
 *
 * This runs on the server before persistence and again before public render.
 * The second pass is intentional: it also protects legacy rows that may have
 * been written before sanitization existed or changed outside the CMS.
 *
 * Keep this allowlist deliberately small. Article content does not need
 * scripts, inline styles, forms, embedded frames, SVG, event handlers, or data
 * URLs. Adding a new rich-text feature should update this policy explicitly.
 */
export function sanitizeArticleHtml(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [...ARTICLE_TAGS],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "title", "width", "height"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"]
    },
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
    nonTextTags: [
      "script",
      "style",
      "textarea",
      "option",
      "xmp",
      "iframe",
      "object",
      "embed",
      "template"
    ]
  });
}

/**
 * JSON-LD lives inside a <script> element. JSON.stringify alone can contain a
 * literal '<' from CMS text, so escape it before embedding to prevent an
 * injected closing script tag from breaking out of the JSON-LD block.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
