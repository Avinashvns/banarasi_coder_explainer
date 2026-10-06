import ArrayGrid from "./ArrayGrid";
import Array3DViewer from "./Array3DViewer";
import VisualExplanation from "./VisualExplanation";

function get3DConcept(visualMode, metrics) {
  const [depth, rows, columns] = metrics.shape;

  const concepts = {
    shape: {
      title: "SHAPE",
      explanation: () =>
        `${depth} blocks × ${rows} rows × ${columns} columns.`,
    },
    ndim: {
      title: "NDIM",
      explanation: () =>
        "This is a 3D array. It has three dimensions: depth, rows and columns.",
    },
    axis: {
      title: "AXIS",
      explanation: () =>
        "Axis 0 moves through depth. Axis 1 moves through rows. Axis 2 moves through columns.",
    },
    size: {
      title: "SIZE",
      explanation: () =>
        `${depth} × ${rows} × ${columns} = ${metrics.size} total elements.`,
    },
    dtype: {
      title: "DTYPE",
      explanation: () =>
        `The current values are represented as ${metrics.dtype}.`,
    },
  };

  return concepts[visualMode] ?? concepts.shape;
}

function ArrayPlayground({
  array,
  selectedCell,
  onCellClick,
  visualMode,
  activeConcept,
  metrics,
}) {
  const is3D = metrics?.ndim === 3;
  const explanationConcept = is3D
    ? get3DConcept(visualMode, metrics)
    : activeConcept;

  return (
    <section className="playground-column">
      <div className="playground-header">
        <h2>ARRAY PLAYGROUND</h2>
      </div>

      <div className={`playground ${is3D ? "playground-3d" : ""}`}>
        {is3D ? (
          <Array3DViewer
            array={array}
            selectedCell={selectedCell}
            onCellClick={onCellClick}
          />
        ) : (
          <ArrayGrid
            array={array}
            selectedCell={selectedCell}
            onCellClick={onCellClick}
            visualMode={visualMode}
          />
        )}

        <VisualExplanation
          concept={explanationConcept}
          metrics={metrics}
        />
      </div>
    </section>
  );
}

export default ArrayPlayground;
