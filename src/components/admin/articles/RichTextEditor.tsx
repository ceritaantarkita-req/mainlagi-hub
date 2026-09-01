"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/Icon";

/**
 * A small contentEditable-based rich text editor. Deliberately not built on
 * a third-party editor framework: this admin tool ships inside a Next.js app
 * bundled by OpenNext for Cloudflare Workers, a pipeline that is already
 * fragile on Windows (see the WARN lines `npm run deploy` prints) -- adding
 * a heavier editor dependency here is a bigger risk than the polish it buys.
 * `document.execCommand` is deprecated but still implemented by every
 * evergreen browser for exactly this list of commands.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    if (ref.current) ref.current.innerHTML = value || "";
    hydrated.current = true;
    // Intentionally runs once: after the first paint the DOM is the source
    // of truth, so later prop changes (our own onChange echoing back) must
    // not stomp the user's cursor position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sync = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const run = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    sync();
  };

  const addLink = () => {
    const url = window.prompt("URL tautan:");
    if (!url) return;
    run("createLink", url);
  };

  const addImage = () => {
    const url = window.prompt("URL gambar:");
    if (!url) return;
    run("insertImage", url);
  };

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar" role="toolbar" aria-label="Format teks">
        <button type="button" title="Tebal" onClick={() => run("bold")}>
          <Icon name="bold" size={16} />
        </button>
        <button type="button" title="Miring" onClick={() => run("italic")}>
          <Icon name="italic" size={16} />
        </button>
        <span className="rich-editor__sep" />
        <button type="button" title="Judul bagian" onClick={() => run("formatBlock", "h2")}>
          <Icon name="heading" size={16} />
        </button>
        <button type="button" title="Paragraf" onClick={() => run("formatBlock", "p")}>
          P
        </button>
        <span className="rich-editor__sep" />
        <button type="button" title="Daftar" onClick={() => run("insertUnorderedList")}>
          <Icon name="list" size={16} />
        </button>
        <button type="button" title="Daftar bernomor" onClick={() => run("insertOrderedList")}>
          <Icon name="listOrdered" size={16} />
        </button>
        <button type="button" title="Kutipan" onClick={() => run("formatBlock", "blockquote")}>
          <Icon name="quote" size={16} />
        </button>
        <span className="rich-editor__sep" />
        <button type="button" title="Tautan" onClick={addLink}>
          <Icon name="link" size={16} />
        </button>
        <button type="button" title="Gambar" onClick={addImage}>
          <Icon name="image" size={16} />
        </button>
      </div>
      <div
        ref={ref}
        className="rich-editor__surface"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={sync}
        onBlur={sync}
      />
    </div>
  );
}
