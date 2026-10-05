function ArrayInput({ value, onChange, onApply, error }) {
  return (
    <section className="array-input-panel">

      <textarea
        className="array-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="[[1, 2, 3], [4, 5, 6]]"
        spellCheck="false"
      />

      {error && (
        <div className="array-input-error">
          {error}
        </div>
      )}

      <button
        className="apply-array-button"
        onClick={onApply}
      >
        APPLY ARRAY
      </button>

    </section>
  );
}

export default ArrayInput;