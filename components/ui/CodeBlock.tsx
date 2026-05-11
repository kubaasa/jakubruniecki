type TokenKind =
  | "keyword"
  | "string"
  | "number"
  | "boolean"
  | "punct"
  | "ident"
  | "comment"
  | "plain";

export type Token = { kind: TokenKind; text: string };
export type CodeLine = ReadonlyArray<Token>;

type CodeBlockProps = {
  lines: ReadonlyArray<CodeLine>;
  showLineNumbers?: boolean;
};

const tokenClass: Record<TokenKind, string> = {
  keyword: "text-accent-keyword",
  string: "text-accent-string",
  number: "text-accent-number",
  boolean: "text-accent-blue",
  punct: "text-fg",
  ident: "text-accent-blue",
  comment: "text-fg-muted",
  plain: "text-fg",
};

export function CodeBlock({ lines, showLineNumbers = false }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
      <code>
        {lines.map((line, lineIdx) => (
          <div key={lineIdx} className="flex">
            {showLineNumbers ? (
              <span
                aria-hidden
                className="mr-4 inline-block w-6 select-none text-right text-fg-subtle"
              >
                {lineIdx + 1}
              </span>
            ) : null}
            <span>
              {line.length === 0 ? " " : null}
              {line.map((token, tokenIdx) => (
                <span key={tokenIdx} className={tokenClass[token.kind]}>
                  {token.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </code>
    </pre>
  );
}
