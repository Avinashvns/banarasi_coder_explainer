import { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

function CodePreview({
  data,
  style,
  setData,
  setSettings,
}) {
  /* ========================================
     GENERATE CODE
  ======================================== */

  const generateCode = () => {
    return `import matplotlib.pyplot as plt

x = ${JSON.stringify(data.x)}
y = ${JSON.stringify(data.y)}

plt.plot(x, y, linewidth=${style.lineWidth})

plt.title("${style.title}")
plt.xlabel("${style.xlabel}")
plt.ylabel("${style.ylabel}")

${style.grid ? "plt.grid()" : ""}

plt.show()`;
  };

  const [code, setCode] = useState(generateCode());
  const [error, setError] = useState("");

  useEffect(() => {
    setCode(generateCode());
  }, [data, style]);


  /* ========================================
     PARSE ARRAY
  ======================================== */

  const parseArray = (variable) => {
    const regex = new RegExp(
      `(?:^|\\n)\\s*${variable}\\s*=\\s*\\[([^\\]]*)\\]`
    );

    const match = code.match(regex);

    if (!match) {
      return null;
    }

    const values = match[1]
      .split(",")
      .map((value) => Number(value.trim()));

    if (
      values.length === 0 ||
      values.some((value) => Number.isNaN(value))
    ) {
      return null;
    }

    return values;
  };


  /* ========================================
     PARSE STRING
  ======================================== */

  const parseString = (functionName) => {
    const regex = new RegExp(
      `plt\\.${functionName}\\(\\s*["']([^"']*)["']\\s*\\)`
    );

    const match = code.match(regex);

    return match ? match[1] : null;
  };


  /* ========================================
     PARSE LINE WIDTH
  ======================================== */

  const parseLineWidth = () => {
    const match = code.match(
      /linewidth\s*=\s*([0-9.]+)/
    );

    if (!match) {
      return null;
    }

    const value = Number(match[1]);

    if (!Number.isFinite(value)) {
      return null;
    }

    return Math.min(Math.max(value, 1), 10);
  };


  /* ========================================
     RUN CODE
  ======================================== */

  const runCode = () => {
    setError("");

    const newX = parseArray("x");
    const newY = parseArray("y");

    if (!newX || !newY) {
      setError("Invalid x or y data.");
      return;
    }

    if (newX.length !== newY.length) {
      setError("x and y must have the same length.");
      return;
    }

    if (newX.length === 0) {
      setError("x and y cannot be empty.");
      return;
    }

    const newTitle = parseString("title");
    const newXLabel = parseString("xlabel");
    const newYLabel = parseString("ylabel");
    const newLineWidth = parseLineWidth();
    const newGrid =
      /plt\.grid\s*\(\s*\)/.test(code);

    setData({
      x: newX,
      y: newY,
    });

    setSettings({
      title:
        newTitle !== null
          ? newTitle
          : style.title,

      xlabel:
        newXLabel !== null
          ? newXLabel
          : style.xlabel,

      ylabel:
        newYLabel !== null
          ? newYLabel
          : style.ylabel,

      lineWidth:
        newLineWidth !== null
          ? newLineWidth
          : style.lineWidth,
      
      grid: newGrid,
    });
  };


  /* ========================================
     MONACO THEME
  ======================================== */

  const defineTheme = (monaco) => {
    monaco.editor.defineTheme(
      "banarasi-python-dark",
      {
        base: "vs-dark",
        inherit: true,

        rules: [
          {
            token: "keyword",
            foreground: "C084FC",
            fontStyle: "bold",
          },

          {
            token: "string",
            foreground: "F59E0B",
          },

          {
            token: "number",
            foreground: "67E8F9",
          },

          {
            token: "comment",
            foreground: "64748B",
          },

          {
            token: "type",
            foreground: "22D3EE",
          },

          {
            token: "function",
            foreground: "60A5FA",
            fontStyle: "bold",
          },

          {
            token: "delimiter",
            foreground: "CBD5E1",
          },
        ],

        colors: {
          /* ====================================
             EDITOR
          ==================================== */

          "editor.background": "#080D1A",
          "editor.foreground": "#F8FAFC",

          "editorLineNumber.foreground": "#475569",
          "editorLineNumber.activeForeground": "#C084FC",

          "editorCursor.foreground": "#C084FC",

          "editor.selectionBackground": "#4C1D95",
          "editor.selectionForeground": "#FFFFFF",

          "editor.lineHighlightBackground": "#0D1425",


          /* ====================================
             INDENTATION
          ==================================== */

          "editorIndentGuide.background1": "#1E293B",
          "editorIndentGuide.activeBackground1": "#334155",


          /* ====================================
             BRACKETS
          ==================================== */

          "editorBracketMatch.background": "#312E81",
          "editorBracketMatch.border": "#A855F7",


          /* ====================================
             WIDGETS
          ==================================== */

          "editorWidget.background": "#0D1425",
          "editorWidget.foreground": "#F8FAFC",
          "editorWidget.border": "#475569",


          /* ====================================
             SCROLLBAR
          ==================================== */

          "scrollbarSlider.background": "#33415F99",
          "scrollbarSlider.hoverBackground": "#A855F799",
          "scrollbarSlider.activeBackground": "#A855F7AA",
        },
      }
    );
  };


  /* ========================================
     EDITOR MOUNT
  ======================================== */

  const handleEditorMount = (editor, monaco) => {

    /* ====================================
       CTRL + ENTER → RUN
    ==================================== */

    editor.addAction({
      id: "run-python-code",

      label: "Run Python Code",

      keybindings: [
        monaco.KeyMod.CtrlCmd |
        monaco.KeyCode.Enter,
      ],

      run: () => {
        runCode();
      },
    });
  };


  /* ========================================
     UI
  ======================================== */

  return (
    <div className="code-preview">

      {/* HEADER */}

      <div className="code-header">
        <span>Python Editor</span>

        <button
          type="button"
          className="run-code-button"
          onClick={runCode}
        >
          ▶ Run
        </button>
      </div>


      {/* MONACO EDITOR */}

      <div className="monaco-editor-shell">

        <Editor
          height="100%"
          language="python"

          value={code}

          theme="banarasi-python-dark"

          beforeMount={defineTheme}
          onMount={handleEditorMount}

          onChange={(value) => {
            setCode(value ?? "");
            setError("");
          }}

          options={{
            automaticLayout: true,

            minimap: {
              enabled: false,
            },

            fontFamily:
              '"Cascadia Code", "Fira Code", Consolas, monospace',

            fontSize: 13,

            lineHeight: 21,

            fontLigatures: true,

            padding: {
              top: 18,
              bottom: 18,
            },

            scrollBeyondLastLine: false,

            wordWrap: "off",

            tabSize: 4,

            insertSpaces: true,

            renderWhitespace: "selection",

            smoothScrolling: true,

            cursorBlinking: "smooth",

            cursorSmoothCaretAnimation: "on",

            bracketPairColorization: {
              enabled: true,
            },

            guides: {
              indentation: true,
              bracketPairs: true,
            },

            autoClosingBrackets: "always",

            autoClosingQuotes: "always",

            formatOnPaste: true,

            formatOnType: true,

            folding: true,

            contextmenu: true,

            overviewRulerBorder: false,

            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />

      </div>


      {/* ERROR */}

      {error && (
        <div className="code-error">
          {error}
        </div>
      )}

    </div>
  );
}

export default CodePreview;