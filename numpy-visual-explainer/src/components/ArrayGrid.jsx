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

  const gridColumns =
    `${labelWidth}px repeat(${columnCount}, ${cellWidth}px)`;

  const getCellVisualClass = (rowIndex, colIndex) => {
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

    if (visualMode === "indexing") {
      return "indexing-highlight";
    }

    if (visualMode === "row-selection") {
      return selectedCell?.row === rowIndex
        ? "row-selection-highlight"
        : "";
    }

    if (visualMode === "column-selection") {
      return selectedCell?.col === colIndex
        ? "column-selection-highlight"
        : "";
    }

    return "";
  };

  const getIndexText = (rowIndex, colIndex) =>
    is2D
      ? `[${rowIndex}, ${colIndex}]`
      : `[${colIndex}]`;

  const handleRowLabelClick = (rowIndex) => {
    if (visualMode !== "row-selection") {
      return;
    }

    onCellClick({
      row: rowIndex,
      col: 0,
      value: rows[rowIndex][0],
    });
  };

  const handleColumnLabelClick = (colIndex) => {
    if (visualMode !== "column-selection") {
      return;
    }

    onCellClick({
      row: 0,
      col: colIndex,
      value: rows[0][colIndex],
    });
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

      {visualMode === "axis" && (
        <div
          className="axis-guide"
          style={{
            gridTemplateColumns: gridColumns,
          }}
        >
          <div className="axis-row-guide">
            <span>AXIS 0</span>
            <span className="axis-arrow-down">↓</span>
            <span>ROWS</span>
          </div>

          <div className="axis-column-guide">
            <span>AXIS 1</span>
            <span className="axis-arrow-right">→</span>
            <span>COLUMNS</span>
          </div>
        </div>
      )}

      {visualMode === "indexing" && (
        <div
          className="indexing-guide"
          style={{
            gridTemplateColumns: gridColumns,
          }}
        >
          <div />

          <div className="indexing-guide-content">
            <span>
              {is2D ? "ROW, COLUMN" : "INDEX"}
            </span>
          </div>
        </div>
      )}

      {(visualMode === "row-selection" ||
        visualMode === "column-selection") && (
        <div
          className="selection-guide"
          style={{
            gridTemplateColumns: gridColumns,
          }}
        >
          <div />

          <div className="selection-guide-content">
            {visualMode === "row-selection"
              ? "CLICK A ROW"
              : "CLICK A COLUMN"}
          </div>
        </div>
      )}

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
            className={`axis-label column-label ${
              visualMode === "axis"
                ? "axis-index-highlight"
                : ""
            } ${
              visualMode === "column-selection" &&
              selectedCell?.col === colIndex
                ? "selection-index-highlight"
                : ""
            }`}
            onClick={() =>
              handleColumnLabelClick(colIndex)
            }
            role={
              visualMode === "column-selection"
                ? "button"
                : undefined
            }
            tabIndex={
              visualMode === "column-selection"
                ? 0
                : undefined
            }
            onKeyDown={(event) => {
              if (
                visualMode === "column-selection" &&
                (event.key === "Enter" ||
                  event.key === " ")
              ) {
                event.preventDefault();
                handleColumnLabelClick(colIndex);
              }
            }}
          >
            {colIndex}
          </div>
        ))}
      </div>

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
            <div
              className={`axis-label row-label ${
                visualMode === "axis"
                  ? "axis-index-highlight"
                  : ""
              } ${
                visualMode === "row-selection" &&
                selectedCell?.row === rowIndex
                  ? "selection-index-highlight"
                  : ""
              }`}
              onClick={() =>
                handleRowLabelClick(rowIndex)
              }
              role={
                visualMode === "row-selection"
                  ? "button"
                  : undefined
              }
              tabIndex={
                visualMode === "row-selection"
                  ? 0
                  : undefined
              }
              onKeyDown={(event) => {
                if (
                  visualMode === "row-selection" &&
                  (event.key === "Enter" ||
                    event.key === " ")
                ) {
                  event.preventDefault();
                  handleRowLabelClick(rowIndex);
                }
              }}
            >
              {rowIndex}
            </div>

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
                  className={`array-cell ${
                    isSelected ? "selected" : ""
                  } ${visualClass}`}
                  onClick={() =>
                    onCellClick({
                      row: rowIndex,
                      col: colIndex,
                      value,
                    })
                  }
                >
                  <span className="cell-value">
                    {String(value)}
                  </span>

                  {visualMode === "indexing" && (
                    <span className="cell-index">
                      {getIndexText(
                        rowIndex,
                        colIndex
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {visualMode === "size" && (
        <div className="size-visual">
          <div className="size-calculation">
            <strong>{rowCount}</strong>
            <span>ROWS</span>
            <span className="size-symbol">×</span>
            <strong>{columnCount}</strong>
            <span>COLUMNS</span>
            <span className="size-symbol">=</span>
            <strong className="size-total">
              {totalElements}
            </strong>
            <span>TOTAL ELEMENTS</span>
          </div>
        </div>
      )}

      {visualMode === "dtype" && (
        <div className="dtype-guide">
          <span className="dtype-type">
            {typeof rows[0][0] === "number"
              ? Number.isInteger(rows[0][0])
                ? "INTEGER"
                : "FLOAT"
              : typeof rows[0][0]}
          </span>

          <span className="dtype-arrow">→</span>

          <span className="dtype-value">
            {typeof rows[0][0] === "number"
              ? Number.isInteger(rows[0][0])
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
