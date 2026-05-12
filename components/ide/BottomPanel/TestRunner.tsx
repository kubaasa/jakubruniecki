"use client";

import { useEffect, useRef, useState } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { PlayIcon, StopIcon } from "@/components/ui/Icon";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TestRunner() {
  const { state, dispatch } = useIDE();
  const [running, setRunning] = useState(false);
  const abortRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const startedRef = useRef(false);

  function clearTimeouts() {
    for (const id of timeoutsRef.current) clearTimeout(id);
    timeoutsRef.current = [];
  }

  function passAllImmediately() {
    state.testSuites.forEach((suite, sIdx) => {
      suite.cases.forEach((_c, cIdx) => {
        dispatch({ type: "TEST_UPDATE", suiteIdx: sIdx, caseIdx: cIdx, status: "pass" });
      });
    });
  }

  function runCycle() {
    dispatch({ type: "TEST_RESET" });
    abortRef.current = false;
    setRunning(true);

    if (prefersReducedMotion()) {
      passAllImmediately();
      setRunning(false);
      return;
    }

    let cumulative = 600;
    state.testSuites.forEach((suite, sIdx) => {
      suite.cases.forEach((c, cIdx) => {
        const startId = window.setTimeout(() => {
          if (abortRef.current) return;
          dispatch({
            type: "TEST_UPDATE",
            suiteIdx: sIdx,
            caseIdx: cIdx,
            status: "running",
          });
        }, cumulative);
        const passId = window.setTimeout(() => {
          if (abortRef.current) return;
          dispatch({
            type: "TEST_UPDATE",
            suiteIdx: sIdx,
            caseIdx: cIdx,
            status: "pass",
          });
        }, cumulative + c.durMs * 12);
        timeoutsRef.current.push(startId, passId);
        cumulative += c.durMs * 12 + 80;
      });
    });

    const doneId = window.setTimeout(() => {
      setRunning(false);
    }, cumulative + 100);
    timeoutsRef.current.push(doneId);
  }

  function stopCycle() {
    abortRef.current = true;
    clearTimeouts();
    setRunning(false);
    state.testSuites.forEach((suite, sIdx) => {
      suite.cases.forEach((c, cIdx) => {
        if (c.status === "running") {
          dispatch({ type: "TEST_UPDATE", suiteIdx: sIdx, caseIdx: cIdx, status: "idle" });
        }
      });
    });
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const bootId = window.setTimeout(() => runCycle(), 800);
    timeoutsRef.current.push(bootId);
    return () => clearTimeouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onRun() {
      runCycle();
    }
    window.addEventListener("ide:run-all-tests", onRun);
    return () => window.removeEventListener("ide:run-all-tests", onRun);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = state.testSuites.flatMap((s) => s.cases);
  const passed = totals.filter((c) => c.status === "pass").length;
  const total = totals.length;
  const summary = running
    ? `Running ${passed}/${total}`
    : passed === total
      ? `${passed} passed`
      : passed > 0
        ? `${passed}/${total} ready`
        : "ready";

  function scrollToCase(file: string, caseName: string) {
    dispatch({ type: "OPEN_FILE", path: file });
    window.setTimeout(() => {
      const root = document.querySelector('[aria-label="Editor"]');
      if (!root) return;
      const lineEls = root.querySelectorAll("pre code > div");
      for (const el of Array.from(lineEls)) {
        if (el.textContent?.includes(caseName)) {
          (el as HTMLElement).scrollIntoView({ block: "center" });
          (el as HTMLElement).style.animation = "tick-flash 0.6s ease-out";
          window.setTimeout(() => {
            (el as HTMLElement).style.animation = "";
          }, 700);
          break;
        }
      }
    }, 50);
  }

  return (
    <div
      className="flex h-full w-1/2 flex-col border-l border-border bg-bg-base"
      role="region"
      aria-label="Test runner"
    >
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-surface px-3 py-1.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runCycle}
            disabled={running}
            className="flex items-center gap-1 rounded border border-accent-green/40 bg-accent-green/10 px-2 py-0.5 font-mono text-[11px] text-accent-green hover:bg-accent-green/20 disabled:opacity-50"
          >
            <PlayIcon className="h-3 w-3" width={12} height={12} />
            RUN ALL
          </button>
          <button
            type="button"
            onClick={stopCycle}
            disabled={!running}
            className={`flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[11px] disabled:opacity-40 ${
              running
                ? "border-accent-red/50 bg-accent-red/15 text-accent-red hover:bg-accent-red/25"
                : "border-border bg-bg-subtle text-fg-muted hover:text-fg"
            }`}
          >
            <StopIcon className="h-3 w-3" width={12} height={12} />
            STOP
          </button>
        </div>
        <div className="font-mono text-[11px] text-fg-muted">{summary}</div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-[12px]">
        {state.testSuites.map((suite) => {
          const allPass = suite.cases.every((c) => c.status === "pass");
          return (
            <div key={suite.name} className="mb-3">
              <div className="flex items-center gap-2 text-fg">
                <span className={allPass ? "text-accent-green" : "text-fg-subtle"}>
                  {allPass ? "✓" : "○"}
                </span>
                <span>{suite.name}</span>
                <span className="text-fg-subtle">— {suite.file}</span>
              </div>
              <ul className="ml-5">
                {suite.cases.map((c) => (
                  <li key={c.name} className="flex items-center gap-2">
                    <span
                      className={
                        c.status === "pass"
                          ? "text-accent-green"
                          : c.status === "fail"
                            ? "text-accent-red"
                            : c.status === "running"
                              ? "inline-block text-accent-yellow"
                              : "text-fg-subtle"
                      }
                      style={
                        c.status === "running"
                          ? { animation: "spin 0.8s linear infinite", display: "inline-block" }
                          : undefined
                      }
                    >
                      {c.status === "pass"
                        ? "✓"
                        : c.status === "fail"
                          ? "✗"
                          : c.status === "running"
                            ? "⟳"
                            : "○"}
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToCase(suite.file, c.name)}
                      className="flex-1 text-left text-fg-muted hover:text-fg"
                    >
                      {c.name}
                    </button>
                    <span className="text-fg-subtle">({c.durMs}ms)</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
