function ArrayInput({ value, onChange, onApply, error }) {
  return (
    <div className="array-input-wrapper">
      <textarea
        className="array-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        aria-label="Array input"
      />

      {error && (
        <div className="array-input-error">
          {error}
        </div>
      )}

      <button
        type="button"
        className="apply-array-button"
        onClick={onApply}
      >
        APPLY ARRAY
      </button>
    </div>
  );
}

export default ArrayInput;