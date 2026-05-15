"use client";

import { useEffect, useRef } from "react";
import { useIDE } from "@/app/ide/IDEContext";
import { PlayIcon, StopIcon } from "@/components/ui/Icon";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TestRunner() {
  const { state, dispatch } = useIDE();
  const running = state.isTestRunning;
  const runningRef = useRef(false);
  const abortRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const stopCycleRef = useRef<() => void>(() => {});

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
    if (runningRef.current) return;
    runningRef.current = true;
    dispatch({ type: "SET_TEST_RUNNING", value: true });
    dispatch({ type: "TEST_RESET" });
    abortRef.current = false;

    if (prefersReducedMotion()) {
      passAllImmediately();
      runningRef.current = false;
      dispatch({ type: "SET_TEST_RUNNING", value: false });
      return;
    }

    // Header lines mimic a real Playwright run.
    dispatch({
      type: "TERMINAL_APPEND",
      line: { kind: "cmd", text: "$ npx playwright test" },
    });
    dispatch({
      type: "TERMINAL_APPEND",
      line: { kind: "output", text: "Running tests using 4 workers..." },
    });

    let cumulative = 600;
    let totalFakeMs = 0;
    let passCount = 0;
    const totalCases = state.testSuites.flatMap((s) => s.cases).length;
    state.testSuites.forEach((suite, sIdx) => {
      suite.cases.forEach((c, cIdx) => {
        // Fake duration matching inspiration's order of magnitude (~40-80× base).
        // Animation actually waits this long, so the displayed ms == real elapsed.
        const fakeMs = Math.round(c.durMs * (40 + Math.random() * 40));
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
            displayDurMs: fakeMs,
          });
          dispatch({
            type: "TERMINAL_APPEND",
            line: {
              kind: "success",
              text: `  ✓ ${suite.name} › ${c.name} (${fakeMs}ms)`,
            },
          });
          passCount += 1;
          totalFakeMs += fakeMs;
        }, cumulative + fakeMs);
        timeoutsRef.current.push(startId, passId);
        cumulative += fakeMs + 40;
      });
    });

    const doneId = window.setTimeout(() => {
      if (abortRef.current) return;
      runningRef.current = false;
      dispatch({ type: "SET_TEST_RUNNING", value: false });
      const totalSec = (totalFakeMs / 1000).toFixed(2);
      dispatch({ type: "TERMINAL_APPEND", line: { kind: "output", text: "" } });
      dispatch({
        type: "TERMINAL_APPEND",
        line: { kind: "success", text: `${passCount} passed (${totalSec}s)` },
      });
      if (passCount === totalCases) {
        dispatch({
          type: "TERMINAL_APPEND",
          line: {
            kind: "success",
            text: "All tests passed. expect(decision).toBe('YES') ✓",
          },
        });
      }
      dispatch({ type: "TERMINAL_APPEND", line: { kind: "output", text: "" } });
    }, cumulative + 100);
    timeoutsRef.current.push(doneId);
  }

  function stopCycle() {
    abortRef.current = true;
    clearTimeouts();
    runningRef.current = false;
    dispatch({ type: "SET_TEST_RUNNING", value: false });
    let passedSoFar = 0;
    state.testSuites.forEach((suite, sIdx) => {
      suite.cases.forEach((c, cIdx) => {
        if (c.status === "pass") {
          passedSoFar += 1;
        }
        if (c.status === "running") {
          dispatch({ type: "TEST_UPDATE", suiteIdx: sIdx, caseIdx: cIdx, status: "idle" });
        }
      });
    });
    dispatch({ type: "TERMINAL_APPEND", line: { kind: "output", text: "" } });
    dispatch({
      type: "TERMINAL_APPEND",
      line: {
        kind: "warn",
        text: `Test run stopped (${passedSoFar} passed)`,
      },
    });
    dispatch({ type: "TERMINAL_APPEND", line: { kind: "output", text: "" } });
  }

  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  useEffect(() => {
    stopCycleRef.current = stopCycle;
  });

  useEffect(() => {
    function onRun() { runCycle(); }
    function onStop() { stopCycleRef.current(); }
    window.addEventListener("ide:run-all-tests", onRun);
    window.addEventListener("ide:stop-tests", onStop);
    return () => {
      window.removeEventListener("ide:run-all-tests", onRun);
      window.removeEventListener("ide:stop-tests", onStop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = state.testSuites.flatMap((s) => s.cases);
  const passed = totals.filter((c) => c.status === "pass").length;
  const total = totals.length;
  const allPassed = !running && passed === total && passed > 0;
  const summary = running
    ? `Running ${passed}/${total}`
    : allPassed
      ? `✓ ${passed} passed`
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
            style={
              running
                ? {
                    backgroundColor: "rgba(248, 81, 73, 0.12)",
                    borderColor: "rgba(248, 81, 73, 0.5)",
                    color: "#f85149",
                  }
                : undefined
            }
            className={`flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide disabled:opacity-40 ${
              running
                ? "hover:shadow-[0_0_12px_rgba(248,81,73,0.35)]"
                : "border-border bg-bg-subtle text-fg-muted hover:text-fg"
            }`}
          >
            <StopIcon className="h-3 w-3" width={12} height={12} />
            STOP
          </button>
        </div>
        <div
          className={`font-mono text-[11px] ${
            allPassed ? "text-accent-green" : "text-fg-muted"
          }`}
        >
          {summary}
        </div>
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
                <span className="ml-auto text-[11px] text-fg-muted">
                  {suite.file}
                </span>
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
                    <span className="text-fg-subtle">
                      {c.status === "pass" && c.displayDurMs !== undefined
                        ? `(${c.displayDurMs}ms)`
                        : ""}
                    </span>
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
