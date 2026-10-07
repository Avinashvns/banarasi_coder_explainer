import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

function CodePreview({
  data,
  style,
  setData,
  setSettings,
}) {
  /* ========================================
     FORMAT STRING PARSER
  ======================================== */

  const parseFormatString = (formatString) => {
    if (!formatString?.trim()) {
      return {};
    }

    const format = formatString.trim();

    const result = {
      color: null,
      lineStyle: null,
      marker: null,
    };

    /* ------------------------------
       COLOR
    ------------------------------ */

    const colorMap = {
      b: "#3b82f6",
      g: "#22c55e",
      r: "#ef4444",
      c: "#06b6d4",
      m: "#ec4899",
      y: "#eab308",
      k: "#111827",
      w: "#ffffff",
    };

    for (const code of Object.keys(colorMap)) {
      if (format.includes(code)) {
        result.color = colorMap[code];
        break;
      }
    }

    /* ------------------------------
       LINE STYLE
    ------------------------------ */

    if (format.includes("--")) {
      result.lineStyle = "--";
    } else if (format.includes("-.")) {
      result.lineStyle = "-.";
    } else if (format.includes(":")) {
      result.lineStyle = ":";
    } else if (format.includes("-")) {
      result.lineStyle = "-";
    }

    /* ------------------------------
       MARKER
    ------------------------------ */

    const markerMap = {
      ".": ".",
      ",": ",",
      o: "o",
      v: "v",
      "^": "^",
      "<": "<",
      ">": ">",
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      s: "s",
      p: "p",
      "*": "*",
      h: "h",
      H: "H",
      "+": "+",
      x: "x",
      X: "X",
      D: "D",
      d: "d",
    };

    for (const code of Object.keys(markerMap)) {
      if (format.includes(code)) {
        result.marker = markerMap[code];
        break;
      }
    }

    return result;
  };

  /* ========================================
     GENERATE CODE
  ======================================== */

  const generateCode = () => {
    let plotCode = "";

    if (style.formatString?.trim()) {
      plotCode = `plt.plot(x, y, "${style.formatString.trim()}")`;
    } else {
      const args = [];

      if (style.color) {
        args.push(`color="${style.color}"`);
      }

      if (style.lineStyle) {
        args.push(`linestyle="${style.lineStyle}"`);
      }

      if (style.lineWidth !== undefined) {
        args.push(`linewidth=${style.lineWidth}`);
      }

      if (style.marker) {
        args.push(`marker="${style.marker}"`);
      }

      if (style.markerSize !== undefined) {
        args.push(`markersize=${style.markerSize}`);
      }

      if (style.markerEdgeColor) {
        args.push(
          `markeredgecolor="${style.markerEdgeColor}"`
        );
      }

      if (style.markerFaceColor) {
        args.push(
          `markerfacecolor="${style.markerFaceColor}"`
        );
      }

      if (style.alpha !== undefined) {
        args.push(`alpha=${style.alpha}`);
      }

      plotCode = `plt.plot(x, y${
        args.length
          ? `, ${args.join(", ")}`
          : ""
      })`;
    }

    return `import matplotlib.pyplot as plt

x = ${JSON.stringify(data.x)}
y = ${JSON.stringify(data.y)}

${plotCode}

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
     PARSE COLOR
  ======================================== */

  const parseColor = () => {
    const match = code.match(
      /color\s*=\s*["']([^"']+)["']/
    );

    if (!match) {
      return null;
    }

    return match[1];
  };

  /* ========================================
     PARSE LINE STYLE
  ======================================== */

  const parseLineStyle = () => {
    const match = code.match(
      /linestyle\s*=\s*["']([^"']+)["']/
    );

    if (!match) {
      return null;
    }

    return match[1];
  };

  /* ========================================
     PARSE MARKER
  ======================================== */

  const parseMarker = () => {
    const match = code.match(
      /marker\s*=\s*["']([^"']+)["']/
    );

    if (!match) {
      return null;
    }

    return match[1];
  };

  /* ========================================
     PARSE MARKER SIZE
  ======================================== */

  const parseMarkerSize = () => {
    const match = code.match(
      /markersize\s*=\s*([0-9.]+)/
    );

    if (!match) {
      return null;
    }

    const value = Number(match[1]);

    if (!Number.isFinite(value)) {
      return null;
    }

    return Math.min(Math.max(value, 1), 20);
  };

  /* ========================================
     PARSE MARKER EDGE COLOR
  ======================================== */

  const parseMarkerEdgeColor = () => {
    const match = code.match(
      /markeredgecolor\s*=\s*["']([^"']+)["']/
    );

    if (!match) {
      return null;
    }

    return match[1];
  };

  /* ========================================
     PARSE MARKER FACE COLOR
  ======================================== */

  const parseMarkerFaceColor = () => {
    const match = code.match(
      /markerfacecolor\s*=\s*["']([^"']+)["']/
    );

    if (!match) {
      return null;
    }

    return match[1];
  };

  /* ========================================
     PARSE ALPHA
  ======================================== */

  const parseAlpha = () => {
    const match = code.match(
      /alpha\s*=\s*([0-9.]+)/
    );

    if (!match) {
      return null;
    }

    const value = Number(match[1]);

    if (!Number.isFinite(value)) {
      return null;
    }

    return Math.min(Math.max(value, 0), 1);
  };

  /* ========================================
     PARSE FORMAT STRING
  ======================================== */

  const parseFormatStringFromCode = () => {
    const match = code.match(
      /plt\.plot\(\s*x\s*,\s*y\s*,\s*["']([^"']+)["']\s*\)/
    );

    if (!match) {
      return null;
    }

    return match[1];
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
    const newColor = parseColor();
    const newLineStyle = parseLineStyle();
    const newMarker = parseMarker();
    const newMarkerSize = parseMarkerSize();
    const newMarkerEdgeColor =
      parseMarkerEdgeColor();
    const newMarkerFaceColor =
      parseMarkerFaceColor();
    const newAlpha = parseAlpha();

    const newFormatString =
      parseFormatStringFromCode();

    const formatStyle =
      parseFormatString(newFormatString);

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

      color:
        newFormatString
          ? formatStyle.color ||
            style.color
          : newColor !== null
          ? newColor
          : style.color,

      lineStyle:
        newFormatString
          ? formatStyle.lineStyle ||
            style.lineStyle
          : newLineStyle !== null
          ? newLineStyle
          : style.lineStyle,

      lineWidth:
        newLineWidth !== null
          ? newLineWidth
          : style.lineWidth,

      marker:
        newFormatString
          ? formatStyle.marker ||
            style.marker
          : newMarker !== null
          ? newMarker
          : style.marker,

      markerSize:
        newMarkerSize !== null
          ? newMarkerSize
          : style.markerSize,

      markerEdgeColor:
        newMarkerEdgeColor !== null
          ? newMarkerEdgeColor
          : style.markerEdgeColor,

      markerFaceColor:
        newMarkerFaceColor !== null
          ? newMarkerFaceColor
          : style.markerFaceColor,

      alpha:
        newAlpha !== null
          ? newAlpha
          : style.alpha,

      formatString:
        newFormatString !== null
          ? newFormatString
          : "",

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
          "editorLineNumber.activeForeground":
            "#C084FC",

          "editorCursor.foreground": "#C084FC",

          "editor.selectionBackground": "#4C1D95",
          "editor.selectionForeground": "#FFFFFF",

          "editor.lineHighlightBackground":
            "#0D1425",

          /* ====================================
             INDENTATION
          ==================================== */

          "editorIndentGuide.background1":
            "#1E293B",
          "editorIndentGuide.activeBackground1":
            "#334155",

          /* ====================================
             BRACKETS
          ==================================== */

          "editorBracketMatch.background":
            "#312E81",
          "editorBracketMatch.border":
            "#A855F7",

          /* ====================================
             WIDGETS
          ==================================== */

          "editorWidget.background": "#0D1425",
          "editorWidget.foreground": "#F8FAFC",
          "editorWidget.border": "#475569",

          /* ====================================
             SCROLLBAR
          ==================================== */

          "scrollbarSlider.background":
            "#33415F99",
          "scrollbarSlider.hoverBackground":
            "#A855F799",
          "scrollbarSlider.activeBackground":
            "#A855F7AA",
        },
      }
    );
  };

  /* ========================================
     EDITOR MOUNT
  ======================================== */

  const handleEditorMount = (
    editor,
    monaco
  ) => {
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