import ArrayInputPanel from "./ArrayInputPanel";
import NumpyCodePanel from "./NumpyCodePanel";

function InputColumn({
  arrayInput,
  onArrayInputChange,
  onApplyArray,
  arrayError,
  code,
}) {
  return (
    <section className="input-column">
      <ArrayInputPanel
        value={arrayInput}
        onChange={onArrayInputChange}
        onApply={onApplyArray}
        error={arrayError}
      />

      <NumpyCodePanel code={code} />
    </section>
  );
}

export default InputColumn;
