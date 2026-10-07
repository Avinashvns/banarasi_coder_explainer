function IntroductionVisual({ selectedTopic }) {
  const highlight = (topic) =>
    selectedTopic === topic ? " highlight" : "";

  const axisHighlight =
    selectedTopic === "axis" ? " highlight" : "";

  return (
    <section className="introduction-visual">
      <div className="visual-title">
        MATPLOTLIB STRUCTURE
      </div>

      <div className="structure-stage">

        {/* FIGURE */}
        <div className={`structure-figure${highlight("figure")}`}>
          <span className="structure-label figure-label">
            FIGURE
          </span>

          {/* AXES */}
          <div className={`structure-axes${highlight("axes")}`}>
            <span className="structure-label axes-label">
              AXES
            </span>

            {/* PLOT AREA */}
            <div
              className={`structure-plot${highlight("plot")}${highlight(
                "plotarea"
              )}`}
            >
              <span className="plot-label">
                PLOT AREA
              </span>

              <svg
                className="structure-chart"
                viewBox="0 0 600 260"
                preserveAspectRatio="none"
              >
                <path
                  d="M45 205 C115 180 135 125 210 150 C280 175 320 105 385 125 C455 145 485 55 555 72"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                <circle cx="45" cy="205" r="7" />
                <circle cx="210" cy="150" r="7" />
                <circle cx="385" cy="125" r="7" />
                <circle cx="555" cy="72" r="7" />
              </svg>
            </div>

            {/* Y AXIS */}
            <div
              className={`structure-y-axis${axisHighlight}${highlight(
                "yaxis"
              )}`}
            >
              <span>Y</span>
            </div>

            {/* X AXIS */}
            <div
              className={`structure-x-axis${axisHighlight}${highlight(
                "xaxis"
              )}`}
            >
              <span>X</span>
            </div>
          </div>
        </div>

      </div>

      <div className="structure-legend">
        <div>
          <span className="legend-dot figure-dot" />
          Figure
        </div>

        <div>
          <span className="legend-dot axes-dot" />
          Axes
        </div>

        <div>
          <span className="legend-dot plot-dot" />
          Plot Area
        </div>

        <div>
          <span className="legend-dot axis-dot" />
          X / Y Axis
        </div>
      </div>
    </section>
  );
}

export default IntroductionVisual;