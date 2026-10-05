import ArrayInput from "./ArrayInput";

function ArrayInputPanel({
  value,
  onChange,
  onApply,
  error,
}) {
  return (
    <>
      <div className="column-title">ARRAY INPUT</div>

      <ArrayInput
        value={value}
        onChange={onChange}
        onApply={onApply}
        error={error}
      />
    </>
  );
}

export default ArrayInputPanel;
