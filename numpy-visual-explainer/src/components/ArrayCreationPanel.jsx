import { ARRAY_CREATION_FUNCTIONS } from "../features/arrayCreation";

const PARAM_LABELS = {
  source: "SOURCE ARRAY",
  shape: "SHAPE",
  fillValue: "VALUE",
  start: "START",
  stop: "STOP",
  step: "STEP",
  count: "COUNT",
  size: "SIZE",
  values: "VALUES",
  low: "LOW",
  high: "HIGH",
  loc: "MEAN",
  scale: "STD DEV",
};

function Field({ name, value, onChange }) {
  const isSource = name === "source";

  return (
    <label className="creation-field">
      <span>{PARAM_LABELS[name]}</span>
      {isSource ? (
        <textarea
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          className="creation-input creation-textarea"
          spellCheck={false}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(name, event.target.value)}
          className="creation-input"
          inputMode="decimal"
          spellCheck={false}
        />
      )}
    </label>
  );
}

function SeedField({ enabled, value, onToggle, onChange }) {
  return (
    <div className="creation-seed-field">
      <label className="seed-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => onToggle(event.target.checked)}
        />
        <span>SEED</span>
      </label>

      <input
        value={value}
        onChange={(event) => onChange("seed", event.target.value)}
        className="creation-input"
        inputMode="numeric"
        disabled={!enabled}
      />
    </div>
  );
}

function getFields(functionName) {
  if (functionName === "np.array") {
    return ["source"];
  }

  if (["np.zeros", "np.ones", "np.empty"].includes(functionName)) {
    return ["shape"];
  }

  if (functionName === "np.full") {
    return ["shape", "fillValue"];
  }

  if (functionName === "np.arange") {
    return ["start", "stop", "step"];
  }

  if (functionName === "np.linspace") {
    return ["start", "stop", "count"];
  }

  if (["np.eye", "np.identity"].includes(functionName)) {
    return ["size"];
  }

  if (functionName === "np.diag") {
    return ["values"];
  }

  if (
    ["np.random.random", "np.random.rand", "np.random.randn"].includes(
      functionName
    )
  ) {
    return ["shape", "seed"];
  }

  if (
    ["np.random.randint", "np.random.uniform"].includes(functionName)
  ) {
    return ["low", "high", "shape", "seed"];
  }

  if (functionName === "np.random.normal") {
    return ["loc", "scale", "shape", "seed"];
  }

  return [];
}

function ArrayCreationPanel({
  functionName,
  params,
  error,
  onFunctionChange,
  onParamChange,
  onSeedToggle,
  onGenerate,
}) {
  const fields = getFields(functionName);

  return (
    <div className="array-creation-panel">
      <div className="column-title">ARRAY CREATION</div>

      <label className="creation-field creation-function-field">
        <span>FUNCTION</span>
        <select
          className="creation-input creation-select"
          value={functionName}
          onChange={(event) => onFunctionChange(event.target.value)}
        >
          {ARRAY_CREATION_FUNCTIONS.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div className="creation-fields">
        {fields
          .filter((field) => field !== "seed")
          .map((field) => (
            <Field
              key={field}
              name={field}
              value={params[field] ?? ""}
              onChange={onParamChange}
            />
          ))}

        {fields.includes("seed") && (
          <SeedField
            enabled={params.useSeed}
            value={params.seed}
            onToggle={onSeedToggle}
            onChange={onParamChange}
          />
        )}
      </div>

      {error && <div className="array-input-error">{error}</div>}

      <button
        type="button"
        className="apply-array-button creation-generate-button"
        onClick={onGenerate}
      >
        GENERATE ARRAY
      </button>
    </div>
  );
}

export default ArrayCreationPanel;
