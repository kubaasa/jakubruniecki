import { useLayoutEffect, useRef, useState } from "react";
import type { Language } from "@/app/ide/types";

type TokenType =
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "fn"
  | "prop"
  | "const"
  | "tag"
  | "punct"
  | "plain";

type Token = { type: TokenType; text: string };

const tsKeywords =
  /\b(import|export|from|as|const|let|var|function|return|async|await|type|interface|class|extends|implements|new|if|else|for|while|do|switch|case|break|continue|true|false|null|undefined|void|typeof|in|of)\b/;

// Optional closing quote (`"?` etc.) keeps in-progress strings classified
// as `string` during the typing animation, so they wrap instead of overflowing.
const tsPatterns: Array<{ type: TokenType; re: RegExp }> = [
  { type: "comment", re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
  { type: "string", re: /`(?:\\.|[^`\\])*`?|"(?:\\.|[^"\\])*"?|'(?:\\.|[^'\\])*'?/ },
  { type: "keyword", re: tsKeywords },
  { type: "number", re: /\b\d+(?:\.\d+)?\b/ },
  { type: "const", re: /\b[A-Z][A-Z0-9_]{2,}\b/ },
  { type: "fn", re: /\b[a-zA-Z_$][\w$]*(?=\s*\()/ },
  { type: "prop", re: /(?<=\.)[a-zA-Z_$][\w$]*/ },
];

const envPatterns: Array<{ type: TokenType; re: RegExp }> = [
  { type: "comment", re: /#[^\n]*/ },
  { type: "keyword", re: /^[A-Z_][A-Z0-9_]*(?==)/m },
  { type: "string", re: /(?<==)[^\n]+/ },
];

const jsonPatterns: Array<{ type: TokenType; re: RegExp }> = [
  { type: "prop", re: /"(?:\\.|[^"\\])*"(?=\s*:)/ },
  { type: "string", re: /"(?:\\.|[^"\\])*"?/ },
  { type: "keyword", re: /\b(?:true|false|null)\b/ },
  { type: "number", re: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/ },
];

function tokenizeLine(line: string, patterns: typeof tsPatterns): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;
  while (cursor < line.length) {
    let bestIdx = -1;
    let bestType: TokenType | null = null;
    let bestText = "";
    for (const { type, re } of patterns) {
      const m = line.slice(cursor).match(re);
      if (!m || m.index === undefined) continue;
      if (bestIdx === -1 || m.index < bestIdx) {
        bestIdx = m.index;
        bestType = type;
        bestText = m[0];
      }
    }
    if (bestType === null || bestIdx === -1) {
      tokens.push({ type: "plain", text: line.slice(cursor) });
      break;
    }
    if (bestIdx > 0) {
      tokens.push({ type: "plain", text: line.slice(cursor, cursor + bestIdx) });
    }
    tokens.push({ type: bestType, text: bestText });
    cursor += bestIdx + bestText.length;
  }
  return tokens;
}

function tokenizeMdLine(line: string): Token[] {
  const heading = /^(#{1,6})\s+(.+)$/.exec(line);
  if (heading) {
    return [
      { type: "keyword", text: heading[1] + " " },
      { type: "tag", text: heading[2] ?? "" },
    ];
  }
  const bullet = /^(\s*[-*]\s)(.+)$/.exec(line);
  if (bullet) {
    return [
      { type: "keyword", text: bullet[1] ?? "" },
      ...inlineMd(bullet[2] ?? ""),
    ];
  }
  return inlineMd(line);
}

function inlineMd(text: string): Token[] {
  const out: Token[] = [];
  const re =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ type: "plain", text: text.slice(last, idx) });
    const tok = m[0];
    if (tok.startsWith("**")) out.push({ type: "keyword", text: tok });
    else if (tok.startsWith("`")) out.push({ type: "string", text: tok });
    else if (tok.startsWith("[")) out.push({ type: "fn", text: tok });
    else out.push({ type: "prop", text: tok });
    last = idx + tok.length;
  }
  if (last < text.length) out.push({ type: "plain", text: text.slice(last) });
  return out;
}

function tokensForLine(line: string, language: Language): Token[] {
  if (language === "ts") return tokenizeLine(line, tsPatterns);
  if (language === "env") return tokenizeLine(line, envPatterns);
  if (language === "json") return tokenizeLine(line, jsonPatterns);
  if (language === "txt") return [{ type: "plain", text: line }];
  return tokenizeMdLine(line);
}

const classFor: Record<TokenType, string> = {
  keyword: "text-sx-keyword",
  string: "text-sx-string",
  number: "text-sx-number",
  comment: "text-sx-comment italic",
  fn: "text-sx-fn",
  prop: "text-sx-prop",
  const: "text-sx-const",
  tag: "text-sx-tag",
  punct: "text-sx-punct",
  plain: "text-fg",
};

const COPYABLE_STRING_THRESHOLD = 60;
const TEST_FN_NAMES = new Set(["test", "describe", "it", "step"]);
// Computed from `text-[13px] leading-[1.6]` (13 * 1.6 = 20.8px per visual row).
const LINE_HEIGHT_PX = 20.8;

function isTestNameString(tokens: Token[], idx: number): boolean {
  for (let k = idx - 1; k >= 0; k--) {
    const prev = tokens[k];
    if (!prev) return false;
    if (prev.type === "fn" || prev.type === "prop") {
      return TEST_FN_NAMES.has(prev.text);
    }
    if (prev.type === "plain" && /^[\s().,]*$/.test(prev.text)) continue;
    return false;
  }
  return false;
}

function unquote(literal: string): string {
  if (literal.length >= 2) {
    const first = literal[0];
    const last = literal[literal.length - 1];
    if ((first === '"' || first === "'" || first === "`") && first === last) {
      return literal.slice(1, -1);
    }
  }
  return literal;
}

function pngFilenameFor(literal: string): string | null {
  const value = unquote(literal);
  if (!value.endsWith(".png")) return null;
  return value.split("/").pop() ?? value;
}

function renderTokens(
  tokens: Token[],
  onCopy?: (value: string) => void,
  onOpenPng?: (filename: string) => void,
) {
  return tokens.map((t, i) => {
    const pngFilename =
      t.type === "string" && onOpenPng ? pngFilenameFor(t.text) : null;
    if (pngFilename) {
      return (
        <button
          key={i}
          type="button"
          onClick={() => onOpenPng?.(pngFilename)}
          className={`${classFor[t.type]} inline cursor-pointer rounded px-0.5 hover:bg-bg-elevated hover:underline focus:bg-bg-elevated focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-blue`}
          title="Open snapshot in a new IDE tab"
        >
          {t.text}
        </button>
      );
    }
    const isCopyable =
      t.type === "string" &&
      t.text.length >= COPYABLE_STRING_THRESHOLD &&
      !/\s/.test(unquote(t.text)) &&
      !isTestNameString(tokens, i);
    if (isCopyable) {
      const value = unquote(t.text);
      return (
        <button
          key={i}
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(value);
            onCopy?.(value);
          }}
          className={`${classFor[t.type]} inline cursor-pointer whitespace-pre-wrap break-all rounded px-0.5 text-left hover:bg-bg-elevated focus:bg-bg-elevated focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-blue`}
          title="Click to copy"
        >
          {t.text}
        </button>
      );
    }
    return (
      <span key={i} className={classFor[t.type]}>
        {t.text}
      </span>
    );
  });
}

export function SyntaxHighlight({
  content,
  language,
  onCopy,
  onOpenPng,
  totalLines,
}: {
  content: string;
  language: Language;
  onCopy?: (value: string) => void;
  onOpenPng?: (filename: string) => void;
  // When provided, line numbers are rendered inline with each line. Each
  // logical line gets as many sequential numbers as visual rows it occupies
  // after wrapping, so wrapped long strings (e.g. JWTs) get their own numbers.
  totalLines?: number;
}) {
  const lines = content.split("\n");
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [rowsPerLine, setRowsPerLine] = useState<number[]>([]);

  useLayoutEffect(() => {
    if (totalLines === undefined) return;
    const refs = contentRefs.current;
    const renderCount = Math.max(totalLines, lines.length);
    const counts: number[] = [];
    for (let i = 0; i < renderCount; i++) {
      const el = refs[i];
      counts[i] = el
        ? Math.max(1, Math.round(el.getBoundingClientRect().height / LINE_HEIGHT_PX))
        : 1;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRowsPerLine((prev) => {
      if (
        prev.length === counts.length &&
        prev.every((v, i) => v === counts[i])
      ) {
        return prev;
      }
      return counts;
    });
  }, [content, totalLines, lines.length]);

  if (totalLines === undefined) {
    return (
      <code className="block whitespace-pre font-mono text-[13px] leading-[1.6]">
        {lines.map((line, lineIdx) => {
          const tokens = tokensForLine(line, language);
          return (
            <div key={lineIdx}>
              {tokens.length === 0 ? " " : null}
              {renderTokens(tokens, onCopy, onOpenPng)}
            </div>
          );
        })}
      </code>
    );
  }

  const renderCount = Math.max(totalLines, lines.length);
  // Reserve gutter width based on the largest plausible visual-row number for
  // this file. We over-reserve a little (totalLines + 50%) so a long wrapped
  // JWT line doesn't push the number into a new digit-width mid-animation.
  const reservedMaxNumber = Math.max(totalLines, Math.ceil(totalLines * 1.5));
  const maxDigits = String(Math.max(reservedMaxNumber, 1)).length;
  const gutterStyle: React.CSSProperties = {
    minWidth: `calc(${maxDigits}ch + 1.5rem + 1px)`,
  };
  const startNums: number[] = [];
  {
    let offset = 0;
    for (let i = 0; i < renderCount; i++) {
      startNums[i] = offset + 1;
      offset += rowsPerLine[i] ?? 1;
    }
  }

  return (
    <code className="block font-mono text-[13px] leading-[1.6]">
      {Array.from({ length: renderCount }, (_, lineIdx) => {
        const lineText = lineIdx < lines.length ? lines[lineIdx] ?? "" : "";
        const tokens = tokensForLine(lineText, language);
        const isTyped = lineIdx < lines.length;
        const rows = rowsPerLine[lineIdx] ?? 1;
        const startNum = startNums[lineIdx] ?? 1;
        return (
          <div key={lineIdx} className="flex items-start">
            <div
              aria-hidden
              className="flex-shrink-0 select-none border-r border-border-subtle px-3 text-right text-fg-subtle"
              style={gutterStyle}
            >
              {Array.from({ length: rows }, (_, i) => (
                <div key={i} style={{ opacity: isTyped ? 1 : 0 }}>
                  {startNum + i}
                </div>
              ))}
            </div>
            <div
              ref={(el) => {
                contentRefs.current[lineIdx] = el;
              }}
              className="min-w-0 flex-1 whitespace-pre pl-4 pr-4"
            >
              {tokens.length === 0 ? " " : null}
              {renderTokens(tokens, onCopy, onOpenPng)}
            </div>
          </div>
        );
      })}
    </code>
  );
}
