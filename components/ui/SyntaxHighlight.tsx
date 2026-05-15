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

const tsPatterns: Array<{ type: TokenType; re: RegExp }> = [
  { type: "comment", re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
  { type: "string", re: /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/ },
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
  { type: "string", re: /"(?:\\.|[^"\\])*"/ },
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

export function SyntaxHighlight({
  content,
  language,
}: {
  content: string;
  language: Language;
}) {
  const lines = content.split("\n");
  return (
    <code className="block whitespace-pre font-mono text-[13px] leading-[1.6]">
      {lines.map((line, lineIdx) => {
        let tokens: Token[];
        if (language === "ts") tokens = tokenizeLine(line, tsPatterns);
        else if (language === "env") tokens = tokenizeLine(line, envPatterns);
        else if (language === "json") tokens = tokenizeLine(line, jsonPatterns);
        else if (language === "txt") tokens = [{ type: "plain", text: line }];
        else tokens = tokenizeMdLine(line);
        return (
          <div key={lineIdx}>
            {tokens.length === 0 ? " " : null}
            {tokens.map((t, i) => (
              <span key={i} className={classFor[t.type]}>
                {t.text}
              </span>
            ))}
          </div>
        );
      })}
    </code>
  );
}
