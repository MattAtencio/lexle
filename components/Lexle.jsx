"use client";

import { useState, useEffect, useCallback } from "react";
import { WORDS, VALID_WORDS } from "@/data/words";

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","\u232B"],
];

function getDailyWord() {
  const epoch = new Date(2025, 0, 1).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayIndex = Math.floor((today.getTime() - epoch) / 86400000);
  return WORDS[dayIndex % WORDS.length];
}

function getDailyKey() {
  const d = new Date();
  return `lexle-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function evaluateGuess(guess, answer) {
  const result = Array(WORD_LENGTH).fill("absent");
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  const used = Array(WORD_LENGTH).fill(false);

  guessArr.forEach((letter, i) => {
    if (letter === answerArr[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  });

  guessArr.forEach((letter, i) => {
    if (result[i] === "correct") return;
    const j = answerArr.findIndex((l, idx) => l === letter && !used[idx]);
    if (j !== -1) {
      result[i] = "present";
      used[j] = true;
    }
  });

  return result;
}

// ─── Tile ──────────────────────────────────────────────────────────────────────
function Tile({ letter, state, colIndex, isRevealing }) {
  const stateStyles = {
    empty:   { borderColor: "#3a3a4a", background: "transparent", color: "#e8e8f0" },
    tbd:     { borderColor: "#7c7c9a", background: "transparent", color: "#e8e8f0" },
    correct: { borderColor: "transparent", background: "#4ade80", color: "#0a0a14" },
    present: { borderColor: "transparent", background: "#f59e0b", color: "#0a0a14" },
    absent:  { borderColor: "transparent", background: "#2a2a3a", color: "#6b6b8a" },
  };

  return (
    <div
      className={[
        letter && !state ? "tile-pop" : "",
        isRevealing && state ? `tile-flip-${colIndex}` : "",
      ].join(" ")}
      style={{
        width: 62,
        height: 62,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 800,
        fontFamily: "'Space Mono', monospace",
        border: "2px solid",
        borderRadius: 4,
        transition: "border-color 0.1s",
        userSelect: "none",
        letterSpacing: 1,
        ...stateStyles[state || "empty"],
      }}
    >
      {letter}
    </div>
  );
}

// ─── Key ───────────────────────────────────────────────────────────────────────
function Key({ label, state, onClick, wide }) {
  const stateColors = {
    correct: { bg: "#4ade80", color: "#0a0a14", border: "transparent" },
    present: { bg: "#f59e0b", color: "#0a0a14", border: "transparent" },
    absent:  { bg: "#1e1e2e", color: "#4a4a6a", border: "#2a2a3a" },
    default: { bg: "#2a2a3a", color: "#d8d8f0", border: "#3a3a5a" },
  };

  const colors = stateColors[state] || stateColors.default;

  return (
    <button
      onClick={() => onClick(label)}
      style={{
        height: 56,
        minWidth: wide ? 80 : 42,
        padding: wide ? "0 8px" : 0,
        background: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        fontSize: label.length > 1 ? 11 : 16,
        fontWeight: 800,
        fontFamily: "'Space Mono', monospace",
        cursor: "pointer",
        transition: "all 0.15s ease",
        letterSpacing: 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label}
    </button>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message }) {
  return (
    <div style={{
      position: "fixed",
      top: 80,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#e8e8f0",
      color: "#0a0a14",
      padding: "10px 22px",
      borderRadius: 8,
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: 1,
      zIndex: 999,
      animation: "fadeInOut 2.5s ease forwards",
      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    }}>
      {message}
    </div>
  );
}

// ─── Onboarding Modal ─────────────────────────────────────────────────────────
const demoTile = {
  width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 16, fontWeight: 800, fontFamily: "'Space Mono', monospace",
  border: "2px solid #3a3a4a", borderRadius: 4, color: "#e8e8f0",
  background: "transparent",
};

function OnboardingModal({ onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
      backdropFilter: "blur(4px)",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#12121e", border: "1px solid #2a2a4a",
        borderRadius: 16, padding: "32px 28px", maxWidth: 360, width: "90%",
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{
            fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700,
            color: "#e8e8f0", letterSpacing: 8, margin: 0,
          }}>LEXLE</h2>
          <p style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#4a4a6a",
            letterSpacing: 4, marginTop: 4,
          }}>DAILY WORD PUZZLE</p>
        </div>

        <p style={{
          fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#c8c8e0",
          lineHeight: 1.6, marginBottom: 16, textAlign: "center",
        }}>
          Guess the 5-letter word in 6 tries. Each guess reveals clues.
        </p>

        {/* Demo tiles */}
        <div style={{
          background: "#07070f", borderRadius: 12, padding: "14px 12px",
          marginBottom: 18, display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ ...demoTile, background: "#4ade80", color: "#0a0a14", borderColor: "transparent" }}>S</div>
            <div style={demoTile}>T</div>
            <div style={demoTile}>A</div>
            <div style={demoTile}>R</div>
            <div style={demoTile}>E</div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#4ade80", marginLeft: 8 }}>CORRECT SPOT</span>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={demoTile}>C</div>
            <div style={{ ...demoTile, background: "#f59e0b", color: "#0a0a14", borderColor: "transparent" }}>R</div>
            <div style={demoTile}>A</div>
            <div style={demoTile}>N</div>
            <div style={demoTile}>E</div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#f59e0b", marginLeft: 8 }}>WRONG SPOT</span>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={demoTile}>T</div>
            <div style={demoTile}>R</div>
            <div style={demoTile}>A</div>
            <div style={demoTile}>I</div>
            <div style={{ ...demoTile, background: "#2a2a3a", color: "#6b6b8a", borderColor: "transparent" }}>L</div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#6b6b8a", marginLeft: 8 }}>NOT IN WORD</span>
          </div>
        </div>

        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7c7c9a",
          lineHeight: 1.8, marginBottom: 8,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ color: "#4ade80", fontSize: 13, lineHeight: 1 }}>{"\u2328"}</span>
            <span>Type a 5-letter word and press <span style={{ color: "#e8e8f0" }}>ENTER</span></span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ color: "#f59e0b", fontSize: 13, lineHeight: 1 }}>{"\uD83D\uDD0D"}</span>
            <span>Use the clues to narrow it down</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ color: "#a78bfa", fontSize: 13, lineHeight: 1 }}>{"\u2728"}</span>
            <span>A new word every day</span>
          </div>
        </div>

        <button onClick={onClose} style={{
          width: "100%", padding: "14px", marginTop: 16,
          background: "linear-gradient(135deg, #059669, #4ade80)",
          border: "none", borderRadius: 10, color: "#0a0a14",
          fontFamily: "'Space Mono', monospace", fontWeight: 800,
          fontSize: 13, letterSpacing: 3, cursor: "pointer",
          boxShadow: "0 6px 24px rgba(74,222,128,0.3)",
        }}>
          PLAY
        </button>
      </div>
    </div>
  );
}

// ─── Stats Modal ───────────────────────────────────────────────────────────────
function StatsModal({ guessCount, answer, won, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "#12121e", border: "1px solid #2a2a4a",
        borderRadius: 16, padding: "36px 40px", maxWidth: 360, width: "90%",
        textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{won ? "\uD83D\uDFE9" : "\uD83D\uDFE5"}</div>
        <h2 style={{
          fontFamily: "'Space Mono', monospace", fontSize: 20, color: "#e8e8f0",
          fontWeight: 700, letterSpacing: 2, marginBottom: 6,
        }}>
          {won ? "SOLVED" : "BETTER LUCK"}
        </h2>
        <p style={{
          fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#7c7c9a",
          letterSpacing: 3, marginBottom: 24,
        }}>
          {won ? `IN ${guessCount} ${guessCount === 1 ? "GUESS" : "GUESSES"}` : "THE WORD WAS"}
        </p>
        {!won && (
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 900,
            color: "#4ade80", letterSpacing: 8, marginBottom: 24,
          }}>
            {answer}
          </div>
        )}
        <button onClick={onClose} style={{
          background: "#4ade80", color: "#0a0a14", border: "none",
          borderRadius: 8, padding: "12px 32px", fontFamily: "'Space Mono', monospace",
          fontWeight: 800, fontSize: 13, letterSpacing: 2, cursor: "pointer",
        }}>
          CLOSE
        </button>
      </div>
    </div>
  );
}

// ─── Main Game ─────────────────────────────────────────────────────────────────
export default function Lexle() {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [toast, setToast] = useState(null);
  const [shakeRow, setShakeRow] = useState(null);
  const [revealingRow, setRevealingRow] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("lexle-onboarded");
  });

  // Load daily state from localStorage
  useEffect(() => {
    const word = getDailyWord();
    setAnswer(word);

    if (typeof window === "undefined") return;
    const key = getDailyKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setGuesses(state.guesses || []);
        setGameOver(state.gameOver || false);
        setWon(state.won || false);
        if (state.gameOver) setShowStats(true);
      } catch { /* ignore corrupt data */ }
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (typeof window === "undefined" || !answer) return;
    const key = getDailyKey();
    localStorage.setItem(key, JSON.stringify({ guesses, gameOver, won }));
  }, [guesses, gameOver, won, answer]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleKey = useCallback((key) => {
    if (gameOver) return;

    if (key === "\u232B" || key === "BACKSPACE") {
      setCurrentInput(prev => prev.slice(0, -1));
      return;
    }

    if (key === "ENTER") {
      if (currentInput.length < WORD_LENGTH) {
        showToast("NOT ENOUGH LETTERS");
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(null), 600);
        return;
      }

      if (!VALID_WORDS.has(currentInput)) {
        showToast("NOT IN WORD LIST");
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(null), 600);
        return;
      }

      const result = evaluateGuess(currentInput, answer);
      const newGuess = { word: currentInput, result };
      const newGuesses = [...guesses, newGuess];
      const isWin = result.every(r => r === "correct");

      setRevealingRow(guesses.length);
      setTimeout(() => {
        setRevealingRow(null);
        setGuesses(newGuesses);
        setCurrentInput("");

        if (isWin) {
          const msgs = ["GENIUS!", "MAGNIFICENT!", "IMPRESSIVE!", "SPLENDID!", "GREAT!", "PHEW!"];
          setTimeout(() => showToast(msgs[guesses.length] || "NICE!"), 200);
          setTimeout(() => { setGameOver(true); setWon(true); setShowStats(true); }, 2200);
        } else if (newGuesses.length >= MAX_GUESSES) {
          setTimeout(() => showToast(answer), 200);
          setTimeout(() => { setGameOver(true); setShowStats(true); }, 2200);
        }
      }, WORD_LENGTH * 80 + 350);

      return;
    }

    if (/^[A-Za-z]$/.test(key) && currentInput.length < WORD_LENGTH) {
      setCurrentInput(prev => prev + key.toUpperCase());
    }
  }, [gameOver, currentInput, guesses, answer]);

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  // Build keyboard state map
  const letterStates = {};
  guesses.forEach(({ word, result }) => {
    word.split("").forEach((letter, i) => {
      const prev = letterStates[letter];
      const curr = result[i];
      if (prev === "correct") return;
      if (curr === "correct") { letterStates[letter] = "correct"; return; }
      if (prev === "present") return;
      letterStates[letter] = curr;
    });
  });

  // Build grid rows
  const rows = [];
  for (let r = 0; r < MAX_GUESSES; r++) {
    const guess = guesses[r];
    const isCurrentRow = r === guesses.length;
    const isRevealing = r === revealingRow;

    const cells = [];
    for (let c = 0; c < WORD_LENGTH; c++) {
      let letter = "";
      let state = null;

      if (guess) {
        letter = guess.word[c];
        state = guess.result[c];
      } else if (isCurrentRow) {
        letter = currentInput[c] || "";
        state = letter ? "tbd" : "empty";
      }

      cells.push(
        <Tile
          key={c}
          letter={isRevealing ? (guess?.word[c] || "") : letter}
          state={isRevealing ? (r < revealingRow ? guess?.result[c] : null) : state}
          colIndex={c}
          isRevealing={isRevealing}
        />
      );
    }

    rows.push(
      <div
        key={r}
        style={{ display: "flex", gap: 6 }}
        className={shakeRow === r ? "shake-row" : ""}
      >
        {cells}
      </div>
    );
  }

  if (!answer) return null;

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0a0a14",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "calc(32px + env(safe-area-inset-bottom))",
      paddingLeft: "env(safe-area-inset-left)",
      paddingRight: "env(safe-area-inset-right)",
    }}>
      {/* Header */}
      <header style={{
        width: "100%",
        maxWidth: 520,
        borderBottom: "1px solid #1e1e2e",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginBottom: 28,
      }}>
        <div style={{
          position: "absolute", left: 20, display: "flex", gap: 6,
        }}>
          {["#4ade80","#f59e0b","#6b7280"].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 28,
            fontWeight: 700,
            color: "#e8e8f0",
            letterSpacing: 10,
            textTransform: "uppercase",
          }}>
            LEXLE
          </h1>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            color: "#4a4a6a",
            letterSpacing: 4,
            marginTop: 2,
          }}>
            GUESS THE WORD
          </p>
        </div>

        <button
          onClick={() => setShowOnboarding(true)}
          style={{
            position: "absolute", right: 20, background: "transparent",
            border: "1px solid #2a2a4a", borderRadius: "50%",
            width: 30, height: 30, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", color: "#4a4a6a",
            fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700,
          }}
        >
          ?
        </button>
      </header>

      {/* Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 32 }}>
        {rows}
      </div>

      {/* Keyboard */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 6 }}>
            {row.map(key => (
              <Key
                key={key}
                label={key}
                state={letterStates[key]}
                onClick={handleKey}
                wide={key === "ENTER" || key === "\u232B"}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        color: "#2a2a4a",
        letterSpacing: 3,
        marginTop: 32,
      }}>
        {"\uD83D\uDFE9"} CORRECT {"\u00B7"} {"\uD83D\uDFE8"} PRESENT {"\u00B7"} {"\u2B1B"} ABSENT
      </p>

      {toast && <Toast message={toast} />}
      {showStats && (
        <StatsModal
          guessCount={guesses.length}
          answer={answer}
          won={won}
          onClose={() => setShowStats(false)}
        />
      )}
      {showOnboarding && (
        <OnboardingModal onClose={() => {
          setShowOnboarding(false);
          if (typeof window !== "undefined") localStorage.setItem("lexle-onboarded", "1");
        }} />
      )}
    </div>
  );
}
