import ArrayGrid from "./ArrayGrid";
import VisualExplanation from "./VisualExplanation";

function ArrayPlayground({
  array,
  selectedCell,
  onCellClick,
  visualMode,
  activeConcept,
  metrics,
}) {
  return (
    <section className="playground-column">
      <div className="playground-header">
        <h2>ARRAY PLAYGROUND</h2>
      </div>

      <div className="playground">
        <ArrayGrid
          array={array}
          selectedCell={selectedCell}
          onCellClick={onCellClick}
          visualMode={visualMode}
        />

        <VisualExplanation
          concept={activeConcept}
          metrics={metrics}
        />
      </div>
    </section>
  );
}

export default ArrayPlayground;
