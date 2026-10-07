import { useState } from "react";

function ChartPreview({ data, style }) {
  const [zoom, setZoom] = useState(1);

  const width = 900;
  const height = 500;

  const padding = {
    top: 55,
    right: 40,
    bottom: 75,
    left: 85,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.y);
  const minValue = Math.min(...data.y);

  const yMax = Math.ceil(maxValue + 1);
  const yMin = Math.max(0, Math.floor(minValue - 1));

  const yRange = yMax - yMin || 1;

  const getX = (index) => {
    if (data.x.length <= 1) {
      return padding.left + chartWidth / 2;
    }

    return (
      padding.left +
      (index / (data.x.length - 1)) * chartWidth
    );
  };

  const getY = (value) => {
    return (
      padding.top +
      chartHeight -
      ((value - yMin) / yRange) * chartHeight
    );
  };

  const points = data.y
    .map((value, index) => `${getX(index)},${getY(value)}`)
    .join(" ");

  const yTicks = [];

  for (let value = yMin; value <= yMax; value++) {
    yTicks.push(value);
  }

  const zoomIn = () => {
    setZoom((value) => Math.min(value + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom((value) => Math.max(value - 0.1, 0.6));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div className="chart-preview">

      <div className="chart-header">
        <h2>{style.title}</h2>

        <div className="zoom-controls">
          <button type="button" onClick={zoomOut}>
            −
          </button>

          <span>{Math.round(zoom * 100)}%</span>

          <button type="button" onClick={zoomIn}>
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

      <div className="chart-viewport">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="line-chart"
        >
          <g
            transform={`translate(${width / 2} ${height / 2}) scale(${zoom}) translate(${-width / 2} ${-height / 2})`}
          >

            {/* Horizontal Grid */}
            {yTicks.map((value) => (
              <line
                key={`grid-${value}`}
                x1={padding.left}
                y1={getY(value)}
                x2={width - padding.right}
                y2={getY(value)}
                className="chart-grid"
              />
            ))}

            {/* Y Axis */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              className="chart-axis"
            />

            {/* X Axis */}
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              className="chart-axis"
            />

            {/* Y Tick Numbers */}
            {yTicks.map((value) => (
              <text
                key={`y-${value}`}
                x={padding.left - 18}
                y={getY(value) + 6}
                textAnchor="end"
                className="chart-tick"
              >
                {value}
              </text>
            ))}

            {/* X Tick Numbers */}
            {data.x.map((value, index) => (
              <text
                key={`x-${index}`}
                x={getX(index)}
                y={height - padding.bottom + 35}
                textAnchor="middle"
                className="chart-tick"
              >
                {value}
              </text>
            ))}

            {/* Line */}
            <polyline
              points={points}
              className="chart-line"
              style={{
                strokeWidth: style.lineWidth,
              }}
            />

            {/* Data Points */}
            {data.y.map((value, index) => (
              <circle
                key={index}
                cx={getX(index)}
                cy={getY(value)}
                r="6"
                className="chart-point"
              />
            ))}

            {/* X Label */}
            <text
              x={width / 2}
              y={height - 20}
              textAnchor="middle"
              className="axis-title"
            >
              {style.xlabel}
            </text>

            {/* Y Label */}
            <text
              x="22"
              y={height / 2}
              textAnchor="middle"
              transform={`rotate(-90 22 ${height / 2})`}
              className="axis-title"
            >
              {style.ylabel}
            </text>

          </g>
        </svg>
      </div>
    </div>
  );
}

export default ChartPreview;