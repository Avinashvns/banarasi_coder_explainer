const inspectorItems = [
  {
    mode: "shape",
    label: "SHAPE",
    getValue: (metrics) =>
      `(${metrics.shape.join(", ")})`,
  },
  {
    mode: "ndim",
    label: "NDIM",
    getValue: (metrics) => metrics.ndim,
  },
  {
    mode: "axis",
    label: "AXIS",
    getValue: (metrics) => metrics.axis.join(" / "),
  },
  {
    mode: "size",
    label: "SIZE",
    getValue: (metrics) => metrics.size,
  },
  {
    mode: "dtype",
    label: "DTYPE",
    getValue: (metrics) => metrics.dtype,
  },
  {
    mode: "indexing",
    label: "INDEXING",
    getValue: (metrics) =>
      metrics.ndim === 1 ? "1D" : "1D / 2D",
  },
  {
    mode: "row-selection",
    label: "ROW",
    value: "SELECT",
  },
  {
    mode: "column-selection",
    label: "COLUMN",
    value: "SELECT",
  },
];

function InspectorMetric({
  item,
  active,
  metrics,
  onClick,
}) {
  const value = item.getValue
    ? item.getValue(metrics)
    : item.value;

  return (
    <button
      type="button"
      className={`metric ${active ? "metric-active" : ""}`}
      onClick={() => onClick(item.mode)}
    >
      <span>{item.label}</span>
      <strong>{value}</strong>
    </button>
  );
}

function SelectedCellPanel({ selectedCell, metrics }) {
  if (!selectedCell) {
    return null;
  }

  return (
    <div className="selected-cell-panel">
      <div className="selected-cell-title">
        SELECTED CELL
      </div>

      <div className="selected-cell-info">
        <div className="selected-cell-item">
          <span>POSITION</span>
          <strong>
            {metrics.ndim === 1
              ? `[${selectedCell.col}]`
              : `[${selectedCell.row}, ${selectedCell.col}]`}
          </strong>
        </div>

        <div className="selected-cell-item">
          <span>VALUE</span>
          <strong>{String(selectedCell.value)}</strong>
        </div>
      </div>
    </div>
  );
}

function ArrayInspector({
  metrics,
  visualMode,
  onConceptClick,
  selectedCell,
}) {
  return (
    <aside className="right-column">
      <section className="inspector-panel">
        <div className="column-title">ARRAY INSPECTOR</div>

        <div className="metrics">
          {inspectorItems.map((item) => (
            <InspectorMetric
              key={item.mode}
              item={item}
              active={visualMode === item.mode}
              metrics={metrics}
              onClick={onConceptClick}
            />
          ))}
        </div>

        <SelectedCellPanel
          selectedCell={selectedCell}
          metrics={metrics}
        />
      </section>
    </aside>
  );
}

export default ArrayInspector;
