function ArrayGrid({
  array,
  selectedCell,
  onCellClick,
  visualMode = "shape",
}) {
  if (!Array.isArray(array) || array.length === 0) {
    return (
      <div className="array-grid-empty">
        No array data
      </div>
    );
  }

  const is2D = Array.isArray(array[0]);
  const rows = is2D ? array : [array];

  const rowCount = rows.length;
  const columnCount = rows[0]?.length || 0;
  const totalElements = rowCount * columnCount;

  if (columnCount === 0) {
    return (
      <div className="array-grid-empty">
        Empty array
      </div>
    );
  }

  const labelWidth = 54;
  const cellWidth = 92;
  const cellHeight = 72;

  const gridColumns = `${labelWidth}px repeat(${columnCount}, ${cellWidth}px)`;

  const getCellVisualClass = (
    rowIndex,
    colIndex
  ) => {
    if (visualMode === "axis") {
      if (rowIndex === 0 || colIndex === 0) {
        return "visual-highlight";
      }

      return "";
    }

    if (
      visualMode === "shape" ||
      visualMode === "ndim" ||
      visualMode === "size" ||
      visualMode === "dtype"
    ) {
      return "visual-highlight";
    }

    return "";
  };

  return (
    <div
      className={`array-grid-wrapper visual-${visualMode}`}
      style={{
        "--row-count": rowCount,
        "--column-count": columnCount,
        "--label-width": `${labelWidth}px`,
        "--cell-width": `${cellWidth}px`,
        "--cell-height": `${cellHeight}px`,
      }}
    >
      {/* =================================================
          SHAPE GUIDE
         ================================================= */}
      {visualMode === "shape" && (
        <div
          className="shape-column-guide"
          style={{
            gridTemplateColumns: gridColumns,
          }}
        >
          <div />

          <div className="shape-column-content">
            <span className="shape-line"></span>

            <strong>{columnCount}</strong>

            <span>COLUMNS</span>

            <span className="shape-line"></span>
          </div>
        </div>
      )}

      {/* =================================================
          NDIM GUIDE
         ================================================= */}
      {visualMode === "ndim" && (
        <div
          className="ndim-guide"
          style={{
            gridTemplateColumns: gridColumns,
          }}
        >
          <div className="ndim-column-direction">
            <span>DIMENSION 1</span>

            <span className="ndim-arrow-right">
              →
            </span>
          </div>
        </div>
      )}

      {/* =================================================
          AXIS GUIDE
         ================================================= */}
      {/* AXIS GUIDE */}
      {visualMode === "axis" && (
        <div
          className="axis-guide"
          style={{
            gridTemplateColumns: gridColumns,
          }}
        >
          <div className="axis-column-direction">
            <span>AXIS 1</span>
            <span className="axis-arrow-right">→</span>
            {/* <span>COLUMNS</span> */}
          </div>
        </div>
      )}

      {/* =================================================
          COLUMN LABELS
         ================================================= */}
      <div
        className="array-column-labels"
        style={{
          gridTemplateColumns: gridColumns,
        }}
      >
        <div className="corner-cell"></div>

        {rows[0].map((_, colIndex) => (
          <div
            key={`column-${colIndex}`}
            className={`axis-label column-label ${visualMode === "axis"
              ? "axis-index-highlight"
              : ""
              }`}
          >
            {colIndex}
          </div>
        ))}
      </div>

      {/* =================================================
          ARRAY
         ================================================= */}
      <div className="array-body">

        {visualMode === "shape" && (
          <div className="shape-row-guide">
            <span className="shape-row-line"></span>

            <div className="shape-row-label">
              <strong>{rowCount}</strong>
              <span>ROWS</span>
            </div>

            <span className="shape-row-line"></span>
          </div>
        )}

        {visualMode === "ndim" && (
          <div className="ndim-row-direction">
            <span className="ndim-row-line"></span>

            <span className="ndim-row-label">
              DIMENSION 2
            </span>

            <span className="ndim-row-line"></span>
          </div>
        )}

        {visualMode === "axis" && (
  <div className="axis-row-direction">
    <span className="axis-row-line"></span>

    <span className="axis-row-label">
      AXIS 0
    </span>

    <span className="axis-row-line"></span>

    
  </div>
)}

        {rows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="array-row"
            style={{
              gridTemplateColumns: gridColumns,
            }}
          >
            {/* ROW INDEX */}
            <div
              className={`axis-label row-label ${visualMode === "axis"
                ? "axis-index-highlight"
                : ""
                }`}
            >
              {rowIndex}
            </div>

            {/* CELLS */}
            {row.map((value, colIndex) => {
              const isSelected =
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex;

              const visualClass =
                getCellVisualClass(
                  rowIndex,
                  colIndex
                );

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  className={`array-cell ${isSelected
                    ? "selected"
                    : ""
                    } ${visualClass}`}
                  onClick={() =>
                    onCellClick({
                      row: rowIndex,
                      col: colIndex,
                      value,
                    })
                  }
                >
                  {String(value)}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* =================================================
          SIZE
         ================================================= */}
      {visualMode === "size" && (
        <div className="size-visual">
          <div className="size-calculation">
            <strong>{rowCount}</strong>

            <span>ROWS</span>

            <span className="size-symbol">
              ×
            </span>

            <strong>{columnCount}</strong>

            <span>COLUMNS</span>

            <span className="size-symbol">
              =
            </span>

            <strong className="size-total">
              {totalElements}
            </strong>

            <span>
              TOTAL ELEMENTS
            </span>
          </div>
        </div>
      )}

      {/* =================================================
          DTYPE
         ================================================= */}
      {visualMode === "dtype" && (
        <div className="dtype-guide">
          <span className="dtype-type">
            {typeof rows[0][0] === "number"
              ? Number.isInteger(
                rows[0][0]
              )
                ? "INTEGER"
                : "FLOAT"
              : typeof rows[0][0]}
          </span>

          <span className="dtype-arrow">
            →
          </span>

          <span className="dtype-value">
            {typeof rows[0][0] === "number"
              ? Number.isInteger(
                rows[0][0]
              )
                ? "int64"
                : "float64"
              : "object"}
          </span>
        </div>
      )}
    </div>
  );
}

export default ArrayGrid;