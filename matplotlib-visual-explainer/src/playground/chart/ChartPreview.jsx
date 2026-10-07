import { useEffect, useMemo, useState } from "react";

import {
  getNiceAxis,
  getCategoricalTicks,
  formatAxisValue,
} from "./axisUtils";

function ChartPreview({ data, style }) {
  const [zoom, setZoom] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredXIndex, setHoveredXIndex] = useState(null);
  const [hoveredYValue, setHoveredYValue] = useState(null);

  const width = 900;
  const height = 500;

  const padding = {
    top: 20,
    right: 30,
    bottom: 65,
    left: 50,
  };

  /* ========================================
     FORMAT STRING
  ======================================== */

  const parseFormatString = (formatString) => {
    if (!formatString?.trim()) {
      return {};
    }

    const format = formatString.trim();

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

    const result = {
      color: null,
      lineStyle: null,
      marker: null,
    };

    /* COLOR */

    for (const code of Object.keys(colorMap)) {
      if (format.includes(code)) {
        result.color = colorMap[code];
        break;
      }
    }

    /* LINE STYLE */

    if (format.includes("--")) {
      result.lineStyle = "--";
    } else if (format.includes("-.")) {
      result.lineStyle = "-.";
    } else if (format.includes(":")) {
      result.lineStyle = ":";
    } else if (format.includes("-")) {
      result.lineStyle = "-";
    }

    /* MARKER */

    const markers = [
      ".",
      ",",
      "o",
      "v",
      "^",
      "<",
      ">",
      "1",
      "2",
      "3",
      "4",
      "s",
      "p",
      "*",
      "h",
      "H",
      "+",
      "x",
      "X",
      "D",
      "d",
    ];

    for (const marker of markers) {
      if (format.includes(marker)) {
        result.marker = marker;
        break;
      }
    }

    return result;
  };

  const formatStyle = parseFormatString(
    style.formatString
  );

  const hasFormat =
    Boolean(style.formatString?.trim());

  const activeColor = hasFormat
    ? formatStyle.color || style.color
    : style.color;

  const activeLineStyle = hasFormat
    ? formatStyle.lineStyle || style.lineStyle
    : style.lineStyle;

  const activeMarker = hasFormat
    ? formatStyle.marker
    : style.marker;

  /* ========================================
     CHART DIMENSIONS
  ======================================== */

  const chartWidth =
    width -
    padding.left -
    padding.right;

  const chartHeight =
    height -
    padding.top -
    padding.bottom;

  /* ========================================
     NUMERIC X
  ======================================== */

  const numericXValues = useMemo(() => {
    return data.x.map(Number);
  }, [data.x]);

  const isNumericX =
    data.x.length > 0 &&
    numericXValues.every(Number.isFinite);

  /* ========================================
     Y AXIS
  ======================================== */

  const yAxis = useMemo(() => {
    return getNiceAxis(data.y, 7);
  }, [data.y]);

  /* ========================================
     X AXIS
  ======================================== */

  const xAxis = useMemo(() => {
    if (isNumericX) {
      return getNiceAxis(
        numericXValues,
        7
      );
    }

    return null;
  }, [
    isNumericX,
    numericXValues,
  ]);

  /* ========================================
     CATEGORICAL X TICKS
  ======================================== */

  const categoricalXTicks = useMemo(() => {
    if (isNumericX) {
      return [];
    }

    return getCategoricalTicks(
      data.x,
      8
    );
  }, [
    data.x,
    isNumericX,
  ]);

  /* ========================================
     Y SCALE
  ======================================== */

  const yMin = yAxis.min;
  const yMax = yAxis.max;

  const yRange =
    yMax - yMin || 1;

  /* ========================================
     X SCALE
  ======================================== */

  const xMin = xAxis?.min ?? 0;
  const xMax = xAxis?.max ?? 1;

  const xRange =
    xMax - xMin || 1;

  /* ========================================
     GET X POSITION
  ======================================== */

  const getX = (index) => {
    if (data.x.length === 0) {
      return (
        padding.left +
        chartWidth / 2
      );
    }

    /* Numeric X */

    if (isNumericX) {
      const value =
        numericXValues[index];

      return (
        padding.left +
        ((value - xMin) /
          xRange) *
          chartWidth
      );
    }

    /* Categorical X */

    if (data.x.length === 1) {
      return (
        padding.left +
        chartWidth / 2
      );
    }

    return (
      padding.left +
      (index /
        (data.x.length - 1)) *
        chartWidth
    );
  };

  /* ========================================
     GET Y POSITION
  ======================================== */

  const getY = (value) => {
    return (
      padding.top +
      chartHeight -
      ((value - yMin) /
        yRange) *
        chartHeight
    );
  };

  /* ========================================
     LINE POINTS
  ======================================== */

  const points = data.y
    .map(
      (value, index) =>
        `${getX(index)},${getY(value)}`
    )
    .join(" ");

  /* ========================================
     ZOOM
  ======================================== */

  const zoomIn = () => {
    setZoom((value) =>
      Math.min(
        value + 0.1,
        2
      )
    );
  };

  const zoomOut = () => {
    setZoom((value) =>
      Math.max(
        value - 0.1,
        0.6
      )
    );
  };

  const resetZoom = () => {
    setZoom(1);
  };

  /* ========================================
     FULLSCREEN
  ======================================== */

  const toggleFullscreen = () => {
    setIsFullscreen(
      (value) => !value
    );
  };

  /* ========================================
     BODY SCROLL
  ======================================== */

  useEffect(() => {
    document.body.style.overflow =
      isFullscreen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [isFullscreen]);

  /* ========================================
     X TICK POSITION
  ======================================== */

  const getNumericXTickPosition = (
    value
  ) => {
    return (
      padding.left +
      ((value - xMin) /
        xRange) *
        chartWidth
    );
  };

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div
      className={`chart-preview ${
        isFullscreen
          ? "chart-fullscreen"
          : ""
      }`}
    >

      {/* ====================================
          HEADER
      ==================================== */}

      <div className="chart-header">

        <h2>{style.title}</h2>

        <div className="chart-actions">

          <button
            type="button"
            className="fullscreen-button"
            onClick={toggleFullscreen}
          >
            {isFullscreen
              ? "⛶ Exit"
              : "⛶ Full Screen"}
          </button>

          <div className="zoom-controls">

            <button
              type="button"
              onClick={zoomOut}
            >
              −
            </button>

            <span>
              {Math.round(
                zoom * 100
              )}
              %
            </span>

            <button
              type="button"
              onClick={zoomIn}
            >
              +
            </button>

            <button
              type="button"
              onClick={resetZoom}
              className="reset-zoom"
            >
              ⟳
            </button>

          </div>

        </div>

      </div>

      {/* ====================================
          CHART VIEWPORT
      ==================================== */}

      <div className="chart-viewport">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="line-chart"
          preserveAspectRatio="xMidYMid meet"
        >

          <g
            transform={`
              translate(
                ${width / 2}
                ${height / 2}
              )
              scale(${zoom})
              translate(
                ${-width / 2}
                ${-height / 2}
              )
            `}
          >

            {/* ==============================
                Y GRID
            ============================== */}

            {style.grid &&
              yAxis.ticks.map(
                (value) => (
                  <line
                    key={`grid-y-${value}`}
                    x1={padding.left}
                    y1={getY(value)}
                    x2={
                      width -
                      padding.right
                    }
                    y2={getY(value)}
                    className="chart-grid"
                  />
                )
              )}

            {/* ==============================
                X GRID
            ============================== */}

            {style.grid &&
              isNumericX &&
              xAxis.ticks.map(
                (value) => (
                  <line
                    key={`grid-x-${value}`}
                    x1={getNumericXTickPosition(
                      value
                    )}
                    y1={padding.top}
                    x2={getNumericXTickPosition(
                      value
                    )}
                    y2={
                      height -
                      padding.bottom
                    }
                    className="chart-grid"
                  />
                )
              )}

            {/* ==============================
                X HOVER GUIDE
            ============================== */}

            {hoveredXIndex !== null && (
              <line
                x1={getX(
                  hoveredXIndex
                )}
                y1={padding.top}
                x2={getX(
                  hoveredXIndex
                )}
                y2={
                  height -
                  padding.bottom
                }
                className="axis-hover-guide"
              />
            )}

            {/* ==============================
                Y HOVER GUIDE
            ============================== */}

            {hoveredYValue !== null && (
              <line
                x1={padding.left}
                y1={getY(
                  hoveredYValue
                )}
                x2={
                  width -
                  padding.right
                }
                y2={getY(
                  hoveredYValue
                )}
                className="axis-hover-guide"
              />
            )}

            {/* ==============================
                Y AXIS
            ============================== */}

            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={
                height -
                padding.bottom
              }
              className="chart-axis"
            />

            {/* ==============================
                X AXIS
            ============================== */}

            <line
              x1={padding.left}
              y1={
                height -
                padding.bottom
              }
              x2={
                width -
                padding.right
              }
              y2={
                height -
                padding.bottom
              }
              className="chart-axis"
            />

            {/* ==============================
                Y TICK NUMBERS
            ============================== */}

            {yAxis.ticks.map(
              (value) => {
                const isActive =
                  hoveredYValue ===
                  value;

                return (
                  <text
                    key={`y-${value}`}
                    x={
                      padding.left -
                      18
                    }
                    y={
                      getY(value) +
                      6
                    }
                    textAnchor="end"
                    className={`chart-tick ${
                      isActive
                        ? "chart-tick-active"
                        : ""
                    }`}
                    onMouseEnter={() =>
                      setHoveredYValue(
                        value
                      )
                    }
                    onMouseLeave={() =>
                      setHoveredYValue(
                        null
                      )
                    }
                  >
                    {formatAxisValue(
                      value,
                      yAxis.step
                    )}
                  </text>
                );
              }
            )}

            {/* ==============================
                NUMERIC X TICKS
            ============================== */}

            {isNumericX &&
              xAxis.ticks.map(
                (value) => {
                  const tickX =
                    getNumericXTickPosition(
                      value
                    );

                  return (
                    <text
                      key={`x-${value}`}
                      x={tickX}
                      y={
                        height -
                        padding.bottom +
                        35
                      }
                      textAnchor="middle"
                      className="chart-tick"
                      onMouseEnter={() => {
                        let nearestIndex = 0;
                        let nearestDistance =
                          Infinity;

                        numericXValues.forEach(
                          (
                            xValue,
                            index
                          ) => {
                            const distance =
                              Math.abs(
                                xValue -
                                value
                              );

                            if (
                              distance <
                              nearestDistance
                            ) {
                              nearestDistance =
                                distance;

                              nearestIndex =
                                index;
                            }
                          }
                        );

                        setHoveredXIndex(
                          nearestIndex
                        );
                      }}
                      onMouseLeave={() =>
                        setHoveredXIndex(
                          null
                        )
                      }
                    >
                      {formatAxisValue(
                        value,
                        xAxis.step
                      )}
                    </text>
                  );
                }
              )}

            {/* ==============================
                CATEGORICAL X TICKS
            ============================== */}

            {!isNumericX &&
              categoricalXTicks.map(
                ({
                  value,
                  index,
                }) => {
                  const isActive =
                    hoveredXIndex ===
                    index;

                  return (
                    <text
                      key={`x-${index}`}
                      x={getX(index)}
                      y={
                        height -
                        padding.bottom +
                        35
                      }
                      textAnchor="middle"
                      className={`chart-tick ${
                        isActive
                          ? "chart-tick-active"
                          : ""
                      }`}
                      onMouseEnter={() =>
                        setHoveredXIndex(
                          index
                        )
                      }
                      onMouseLeave={() =>
                        setHoveredXIndex(
                          null
                        )
                      }
                    >
                      {value}
                    </text>
                  );
                }
              )}

            {/* ==============================
                LINE
            ============================== */}

            <polyline
              points={points}
              className="chart-line"
              style={{
                stroke:
                  activeColor,
                strokeWidth:
                  style.lineWidth,
                opacity:
                  style.alpha,
                strokeDasharray:
                  activeLineStyle === "--"
                    ? "10 7"
                    : activeLineStyle === ":"
                    ? "2 6"
                    : activeLineStyle === "-."
                    ? "10 6 2 6"
                    : "none",
              }}
            />

            {/* ==============================
                DATA POINTS
            ============================== */}

            {data.y.map(
              (value, index) => {
                const isHovered =
                  hoveredIndex ===
                  index;

                return (
                  <g
                    key={`point-${index}`}
                  >

                    {/* HOVER GLOW */}

                    {isHovered && (
                      <circle
                        cx={getX(index)}
                        cy={getY(value)}
                        r="12"
                        className="point-glow"
                        style={{
                          stroke:
                            activeColor,
                        }}
                      />
                    )}

                    {/* DYNAMIC MARKER */}

                    {(() => {
                      const markerSize =
                        Number(
                          style.markerSize
                        ) || 6;

                      const size =
                        isHovered
                          ? markerSize + 3
                          : markerSize;

                      const x =
                        getX(index);

                      const y =
                        getY(value);

                      const commonProps = {
                        className: `chart-point ${
                          isHovered
                            ? "chart-point-active"
                            : ""
                        }`,

                        onMouseEnter:
                          () =>
                            setHoveredIndex(
                              index
                            ),

                        onMouseLeave:
                          () =>
                            setHoveredIndex(
                              null
                            ),

                        fill:
                          style.markerFaceColor ||
                          "#ffffff",

                        stroke:
                          style.markerEdgeColor ||
                          activeColor,

                        strokeWidth: 1.5,

                        opacity:
                          style.alpha ??
                          1,
                      };

                      /* NO MARKER */

                      if (!activeMarker) {
                        return null;
                      }

                      /* CIRCLE */

                      if (
                        activeMarker ===
                        "o"
                      ) {
                        return (
                          <circle
                            cx={x}
                            cy={y}
                            r={
                              size / 2
                            }
                            {...commonProps}
                          />
                        );
                      }

                      /* SQUARE */

                      if (
                        activeMarker ===
                        "s"
                      ) {
                        return (
                          <rect
                            x={
                              x -
                              size / 2
                            }
                            y={
                              y -
                              size / 2
                            }
                            width={size}
                            height={size}
                            rx="1"
                            {...commonProps}
                          />
                        );
                      }

                      /* TRIANGLE */

                      if (
                        activeMarker ===
                        "^"
                      ) {
                        return (
                          <polygon
                            points={`
                              ${x},${
                                y -
                                size / 2
                              }
                              ${
                                x -
                                size / 2
                              },${
                                y +
                                size / 2
                              }
                              ${
                                x +
                                size / 2
                              },${
                                y +
                                size / 2
                              }
                            `}
                            {...commonProps}
                          />
                        );
                      }

                      /* DIAMOND */

                      if (
                        activeMarker ===
                        "D"
                      ) {
                        return (
                          <polygon
                            points={`
                              ${x},${
                                y -
                                size / 2
                              }
                              ${
                                x +
                                size / 2
                              },${y}
                              ${x},${
                                y +
                                size / 2
                              }
                              ${
                                x -
                                size / 2
                              },${y}
                            `}
                            {...commonProps}
                          />
                        );
                      }

                      /* PLUS */

                      if (
                        activeMarker ===
                        "+"
                      ) {
                        const half =
                          size / 2;

                        return (
                          <g
                            className={
                              commonProps.className
                            }
                            opacity={
                              style.alpha ??
                              1
                            }
                            stroke={
                              style.markerEdgeColor ||
                              activeColor
                            }
                            strokeWidth="2"
                            onMouseEnter={
                              commonProps.onMouseEnter
                            }
                            onMouseLeave={
                              commonProps.onMouseLeave
                            }
                          >
                            <line
                              x1={
                                x -
                                half
                              }
                              y1={y}
                              x2={
                                x +
                                half
                              }
                              y2={y}
                            />

                            <line
                              x1={x}
                              y1={
                                y -
                                half
                              }
                              x2={x}
                              y2={
                                y +
                                half
                              }
                            />
                          </g>
                        );
                      }

                      /* STAR */

                      if (
                        activeMarker ===
                        "*"
                      ) {
                        const outer =
                          size / 2;

                        const inner =
                          outer *
                          0.45;

                        const starPoints =
                          [];

                        for (
                          let i = 0;
                          i < 10;
                          i++
                        ) {
                          const angle =
                            -Math.PI / 2 +
                            (i *
                              Math.PI) /
                              5;

                          const radius =
                            i % 2 === 0
                              ? outer
                              : inner;

                          starPoints.push(
                            `${
                              x +
                              Math.cos(
                                angle
                              ) *
                                radius
                            },${
                              y +
                              Math.sin(
                                angle
                              ) *
                                radius
                            }`
                          );
                        }

                        return (
                          <polygon
                            points={starPoints.join(
                              " "
                            )}
                            {...commonProps}
                          />
                        );
                      }

                      /* X MARKER */

                      if (
                        activeMarker ===
                          "x" ||
                        activeMarker ===
                          "X"
                      ) {
                        const half =
                          size / 2;

                        return (
                          <g
                            className={
                              commonProps.className
                            }
                            opacity={
                              style.alpha ??
                              1
                            }
                            stroke={
                              style.markerEdgeColor ||
                              activeColor
                            }
                            strokeWidth="2"
                            onMouseEnter={
                              commonProps.onMouseEnter
                            }
                            onMouseLeave={
                              commonProps.onMouseLeave
                            }
                          >
                            <line
                              x1={
                                x -
                                half
                              }
                              y1={
                                y -
                                half
                              }
                              x2={
                                x +
                                half
                              }
                              y2={
                                y +
                                half
                              }
                            />

                            <line
                              x1={
                                x +
                                half
                              }
                              y1={
                                y -
                                half
                              }
                              x2={
                                x -
                                half
                              }
                              y2={
                                y +
                                half
                              }
                            />
                          </g>
                        );
                      }

                      /* DEFAULT */

                      return (
                        <circle
                          cx={x}
                          cy={y}
                          r={size / 2}
                          {...commonProps}
                        />
                      );
                    })()}

                  </g>
                );
              }
            )}

            {/* ==============================
                DYNAMIC TOOLTIP
            ============================== */}

            {hoveredIndex !== null &&
              (() => {
                const pointX =
                  getX(
                    hoveredIndex
                  );

                const pointY =
                  getY(
                    data.y[
                      hoveredIndex
                    ]
                  );

                const tooltipWidth =
                  110;

                const tooltipHeight =
                  58;

                let tooltipX =
                  pointX -
                  tooltipWidth / 2;

                let tooltipY =
                  pointY -
                  tooltipHeight -
                  16;

                if (
                  tooltipX <
                  padding.left
                ) {
                  tooltipX =
                    padding.left;
                }

                if (
                  tooltipX +
                    tooltipWidth >
                  width -
                    padding.right
                ) {
                  tooltipX =
                    width -
                    padding.right -
                    tooltipWidth;
                }

                if (
                  tooltipY <
                  padding.top
                ) {
                  tooltipY =
                    pointY + 16;
                }

                return (
                  <g
                    className="data-tooltip"
                    transform={`translate(
                      ${tooltipX}
                      ${tooltipY}
                    )`}
                  >
                    <rect
                      width={
                        tooltipWidth
                      }
                      height={
                        tooltipHeight
                      }
                      rx="10"
                      className="tooltip-box"
                    />

                    <text
                      x={
                        tooltipWidth /
                        2
                      }
                      y="23"
                      textAnchor="middle"
                      className="tooltip-text"
                    >
                      X:{" "}
                      {
                        data.x[
                          hoveredIndex
                        ]
                      }
                    </text>

                    <text
                      x={
                        tooltipWidth /
                        2
                      }
                      y="43"
                      textAnchor="middle"
                      className="tooltip-text"
                    >
                      Y:{" "}
                      {
                        data.y[
                          hoveredIndex
                        ]
                      }
                    </text>
                  </g>
                );
              })()}

          </g>
        </svg>

        {/* ==================================
            GLASS AXIS LABELS
        ================================== */}

        <div className="glass-axis-label glass-x-axis">
          {style.xlabel}
        </div>

        <div className="glass-axis-label glass-y-axis">
          {style.ylabel}
        </div>

      </div>
    </div>
  );
}

export default ChartPreview;