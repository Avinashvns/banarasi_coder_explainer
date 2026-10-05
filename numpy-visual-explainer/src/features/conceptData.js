const conceptData = {
  shape: {
    title: "SHAPE",
    value: "shape",
    explanation: (metrics) =>
      `${metrics.shape[0]} rows × ${metrics.shape[1] ?? metrics.shape[0]} columns. Shape tells us the size of every dimension.`,
  },

  ndim: {
    title: "NDIM",
    value: "ndim",
    explanation: (metrics) =>
      `This array has ${metrics.ndim} dimension${metrics.ndim === 1 ? "" : "s"}. A row-and-column grid is a 2D array.`,
  },

  axis: {
    title: "AXIS",
    value: "axis",
    explanation: () =>
      "Axis 0 moves through rows ↓. Axis 1 moves through columns →.",
  },

  size: {
    title: "SIZE",
    value: "size",
    explanation: (metrics) => {
      const rows = metrics.shape[0];
      const columns =
        metrics.shape.length > 1
          ? metrics.shape[1]
          : metrics.shape[0];

      return `${rows} × ${columns} = ${metrics.size} total elements.`;
    },
  },

  dtype: {
    title: "DTYPE",
    value: "dtype",
    explanation: (metrics) =>
      `The current values are represented as ${metrics.dtype}. Dtype describes the type of data stored in the array.`,
  },

  indexing: {
    title: "INDEXING",
    value: "indexing",
    explanation: (metrics) =>
      metrics.ndim === 1
        ? "Click an element to see its 1D index. NumPy uses zero-based indexing: arr[index]."
        : "Click an element to see its 2D index. NumPy uses row and column positions: arr[row, column].",
  },

  "row-selection": {
    title: "ROW SELECTION",
    value: "row-selection",
    explanation: () =>
      "Click any cell in a row to highlight the complete row. The row index stays visible on the left.",
  },

  "column-selection": {
    title: "COLUMN SELECTION",
    value: "column-selection",
    explanation: () =>
      "Click any cell in a column to highlight the complete column. The column index stays visible above.",
  },
};

export default conceptData;
