import { useEffect, useMemo, useState } from "react";

import {
  getNiceAxis,
  getCategoricalTicks,
  formatAxisValue,
} from "./axisUtils";

function ChartPreview({ data, style }) {
  const [zoom, setZoom] = useState(0.8);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [hoveredIndex, setHoveredIndex] =
    useState(null);

  const [hoveredXIndex, setHoveredXIndex] =
    useState(null);

  const [hoveredYValue, setHoveredYValue] =
    useState(null);

  const width = 900;
  const height = 500;

  const padding = {
    top: 20,
    right: 30,
    bottom: 65,
    left: 50,
  };

  const chartWidth =
    width -
    padding.left -
    padding.right;

  const chartHeight =
    height -
    padding.top -
    padding.bottom;


  /* ========================================
     NUMERIC X CHECK
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

    /*
     * Numeric X:
     * use actual X values so uneven
     * numbers get correct spacing.
     */

    if (isNumericX) {
      const value =
        numericXValues[index];

      return (
        padding.left +
        ((value - xMin) / xRange) *
          chartWidth
      );
    }

    /*
     * Categorical X:
     * distribute points evenly.
     */

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

            {yAxis.ticks.map(
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

            {isNumericX &&
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

                        /*
                         * Find nearest data
                         * point for guide.
                         */

                        let nearestIndex =
                          0;

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
                strokeWidth:
                  style.lineWidth,
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

                    {isHovered && (
                      <circle
                        cx={getX(index)}
                        cy={getY(value)}
                        r="12"
                        className="point-glow"
                      />
                    )}

                    <circle
                      cx={getX(index)}
                      cy={getY(value)}
                      r={
                        isHovered
                          ? 8
                          : 6
                      }
                      className={`chart-point ${
                        isHovered
                          ? "chart-point-active"
                          : ""
                      }`}
                      onMouseEnter={() =>
                        setHoveredIndex(
                          index
                        )
                      }
                      onMouseLeave={() =>
                        setHoveredIndex(
                          null
                        )
                      }
                    />

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
                        tooltipWidth / 2
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
                        tooltipWidth / 2
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