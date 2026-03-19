import Link from "next/link";

export const metadata = {
  title: "Lexle — How to Play",
  description: "Learn how to play Lexle, the daily word-guessing game.",
};

export default function HelpPage() {
  const heading = {
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    color: "#4ade80",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 12,
  };

  const paragraph = {
    fontFamily: "'Space Mono', monospace",
    fontSize: 14,
    color: "#c8c8e0",
    lineHeight: 1.8,
    marginBottom: 8,
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0a0a14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px 60px",
      }}
    >
      <div style={{ maxWidth: 520, width: "100%" }}>
        {/* Title */}
        <h1
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 28,
            fontWeight: 700,
            color: "#e8e8f0",
            letterSpacing: 10,
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          LEXLE
        </h1>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: "#4a4a6a",
            letterSpacing: 4,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          GAME GUIDE
        </p>

        {/* How to Play */}
        <h2 style={{ ...heading, fontSize: 16 }}>How to Play</h2>
        <p style={paragraph}>
          Guess the secret 5-letter word in 6 tries. After each guess, the tiles
          change color to show how close you are:
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 32,
            padding: "16px",
            background: "#07070f",
            borderRadius: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                display: "inline-block",
                width: 32,
                height: 32,
                borderRadius: 4,
                background: "#4ade80",
                flexShrink: 0,
              }}
            />
            <span style={paragraph}>
              <strong style={{ color: "#4ade80" }}>Green</strong> — correct
              letter in the correct spot.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                display: "inline-block",
                width: 32,
                height: 32,
                borderRadius: 4,
                background: "#f59e0b",
                flexShrink: 0,
              }}
            />
            <span style={paragraph}>
              <strong style={{ color: "#f59e0b" }}>Amber</strong> — correct
              letter but in the wrong spot.
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                display: "inline-block",
                width: 32,
                height: 32,
                borderRadius: 4,
                background: "#2a2a3a",
                flexShrink: 0,
              }}
            />
            <span style={paragraph}>
              <strong style={{ color: "#6b6b8a" }}>Gray</strong> — letter is not
              in the word.
            </span>
          </div>
        </div>

        {/* Tips */}
        <h2 style={{ ...heading, fontSize: 16 }}>Tips</h2>
        <ul
          style={{
            ...paragraph,
            paddingLeft: 20,
            marginBottom: 32,
          }}
        >
          <li style={{ marginBottom: 8 }}>
            Start with vowel-rich words like <strong style={{ color: "#e8e8f0" }}>STARE</strong>,{" "}
            <strong style={{ color: "#e8e8f0" }}>AUDIO</strong>, or{" "}
            <strong style={{ color: "#e8e8f0" }}>CRANE</strong>.
          </li>
          <li style={{ marginBottom: 8 }}>
            Use process of elimination — pay attention to gray letters and avoid
            reusing them.
          </li>
          <li style={{ marginBottom: 8 }}>
            Look at the keyboard colors to see which letters you have already
            tried.
          </li>
          <li>
            Think about common letter patterns and word endings like{" "}
            <strong style={{ color: "#e8e8f0" }}>-TION</strong>,{" "}
            <strong style={{ color: "#e8e8f0" }}>-IGHT</strong>, or{" "}
            <strong style={{ color: "#e8e8f0" }}>-OUND</strong>.
          </li>
        </ul>

        {/* About */}
        <h2 style={{ ...heading, fontSize: 16 }}>About</h2>
        <ul style={{ ...paragraph, paddingLeft: 20, marginBottom: 40 }}>
          <li style={{ marginBottom: 8 }}>A new word is available every day.</li>
          <li style={{ marginBottom: 8 }}>
            Your progress is saved locally in your browser — you can close the
            tab and come back later.
          </li>
          <li>Everyone gets the same word each day.</li>
        </ul>

        {/* Back to Game */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "14px 40px",
              background: "linear-gradient(135deg, #059669, #4ade80)",
              border: "none",
              borderRadius: 10,
              color: "#0a0a14",
              fontFamily: "'Space Mono', monospace",
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 3,
              textDecoration: "none",
              boxShadow: "0 6px 24px rgba(74,222,128,0.3)",
            }}
          >
            BACK TO GAME
          </Link>
        </div>
      </div>
    </div>
  );
}
