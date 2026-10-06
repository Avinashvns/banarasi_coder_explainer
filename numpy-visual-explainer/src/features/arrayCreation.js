export const ARRAY_CREATION_FUNCTIONS = [
  { key: "np.array", label: "np.array()" },
  { key: "np.zeros", label: "np.zeros()" },
  { key: "np.ones", label: "np.ones()" },
  { key: "np.full", label: "np.full()" },
  { key: "np.empty", label: "np.empty()" },
  { key: "np.arange", label: "np.arange()" },
  { key: "np.linspace", label: "np.linspace()" },
  { key: "np.eye", label: "np.eye()" },
  { key: "np.identity", label: "np.identity()" },
  { key: "np.diag", label: "np.diag()" },
  { key: "np.random.random", label: "np.random.random()" },
  { key: "np.random.rand", label: "np.random.rand()" },
  { key: "np.random.randn", label: "np.random.randn()" },
  { key: "np.random.randint", label: "np.random.randint()" },
  { key: "np.random.uniform", label: "np.random.uniform()" },
  { key: "np.random.normal", label: "np.random.normal()" },
];

export const DEFAULT_CREATION_FUNCTION = "np.zeros";

export const DEFAULT_CREATION_PARAMS = {
  source: "[[1, 2, 3], [4, 5, 6]]",
  shape: "2, 3",
  fillValue: "7",
  start: "0",
  stop: "10",
  step: "1",
  count: "5",
  size: "3",
  values: "1, 2, 3",
  low: "0",
  high: "10",
  loc: "0",
  scale: "1",
  seed: "42",
  useSeed: true,
};

function toNumber(value, label) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return number;
}

function toInteger(value, label) {
  const number = Number(value);

  if (!Number.isInteger(number)) {
    throw new Error(`${label} must be a whole number.`);
  }

  return number;
}

function parseShape(value) {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[()[\]]/g, "");

  if (!cleaned) {
    throw new Error("Shape is required.");
  }

  const parts = cleaned
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const shape = parts.map((part) => toInteger(part, "Shape"));

  if (!shape.length || shape.some((size) => size <= 0)) {
    throw new Error("Shape values must be positive integers.");
  }

  if (shape.length > 3) {
    throw new Error(
      "The current visual playground supports 1D, 2D and 3D arrays."
    );
  }

  return shape;
}

function createFilledArray(shape, value) {
  if (shape.length === 1) {
    return Array.from({ length: shape[0] }, () => value);
  }

  return Array.from(
    { length: shape[0] },
    () => createFilledArray(shape.slice(1), value)
  );
}

function getSourceShape(value) {
  if (!Array.isArray(value)) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new Error("SOURCE ARRAY must contain numeric values.");
    }

    return [];
  }

  if (value.length === 0) {
    throw new Error("Array rows cannot be empty.");
  }

  const childShape = getSourceShape(value[0]);

  for (let index = 1; index < value.length; index += 1) {
    const nextShape = getSourceShape(value[index]);

    if (
      nextShape.length !== childShape.length ||
      nextShape.some((size, axis) => size !== childShape[axis])
    ) {
      throw new Error("All nested arrays must have the same shape.");
    }
  }

  return [value.length, ...childShape];
}

function parseSource(source) {
  let parsed;

  try {
    parsed = JSON.parse(source);
  } catch {
    throw new Error("SOURCE ARRAY must be valid JSON array syntax.");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("SOURCE ARRAY must contain an array.");
  }

  const shape = getSourceShape(parsed);

  if (shape.length > 3) {
    throw new Error("The current visual playground supports up to 3D arrays.");
  }

  return parsed;
}

function parseValues(value) {
  const values = String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => toNumber(item, "Values"));

  if (!values.length) {
    throw new Error("Values are required.");
  }

  return values;
}

function createArange(start, stop, step) {
  if (step === 0) {
    throw new Error("Step cannot be zero.");
  }

  const values = [];
  const maxItems = 10000;

  if (step > 0 && start >= stop) return values;
  if (step < 0 && start <= stop) return values;

  let current = start;
  let guard = 0;

  if (step > 0) {
    while (current < stop && guard < maxItems) {
      values.push(Number(current.toFixed(12)));
      current += step;
      guard += 1;
    }
  } else {
    while (current > stop && guard < maxItems) {
      values.push(Number(current.toFixed(12)));
      current += step;
      guard += 1;
    }
  }

  return values;
}

function createLinspace(start, stop, count) {
  if (count <= 0) {
    throw new Error("Count must be a positive integer.");
  }

  if (count === 1) {
    return [start];
  }

  const step = (stop - start) / (count - 1);

  return Array.from(
    { length: count },
    (_, index) => Number((start + index * step).toFixed(12))
  );
}

/* -------------------------------------------------------
   SEEDED RANDOM GENERATOR
------------------------------------------------------- */

function createSeededRandom(seed) {
  let state = (Number(seed) >>> 0) || 1;

  return () => {
    state += 0x6d2b79f5;

    let t = state;

    t = Math.imul(t ^ (t >>> 15), t | 1);

    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getRandomGenerator(seed) {
  const numericSeed = Number(seed);

  if (!Number.isInteger(numericSeed)) {
    throw new Error("Seed must be a whole number.");
  }

  return createSeededRandom(numericSeed);
}

function randomValue(min, max, rng = Math.random) {
  return min + rng() * (max - min);
}

function createRandomArray(shape, generator) {
  if (shape.length === 1) {
    return Array.from({ length: shape[0] }, generator);
  }

  return Array.from(
    { length: shape[0] },
    () => createRandomArray(shape.slice(1), generator)
  );
}

function normalRandom(mean, stdDev, rng = Math.random) {
  let u = 0;
  let v = 0;

  while (u === 0) {
    u = rng();
  }

  while (v === 0) {
    v = rng();
  }

  const z =
    Math.sqrt(-2 * Math.log(u)) *
    Math.cos(2 * Math.PI * v);

  return mean + z * stdDev;
}

/* -------------------------------------------------------
   ARRAY GENERATION
------------------------------------------------------- */

export function generateArray(functionName, params = {}) {
  const isRandomFunction = functionName.startsWith("np.random.");

  const rng =
    isRandomFunction && params.useSeed
      ? getRandomGenerator(
        params.seed ?? DEFAULT_CREATION_PARAMS.seed
      )
      : Math.random;

  switch (functionName) {
    case "np.array":
      return parseSource(params.source);

    case "np.zeros": {
      const shape = parseShape(params.shape);

      return createFilledArray(shape, 0);
    }

    case "np.ones": {
      const shape = parseShape(params.shape);

      return createFilledArray(shape, 1);
    }

    case "np.full": {
      const shape = parseShape(params.shape);
      const value = toNumber(params.fillValue, "Value");

      return createFilledArray(shape, value);
    }

    case "np.empty": {
      const shape = parseShape(params.shape);

      // JavaScript has no NumPy-style uninitialized memory.
      // Zero is used as a stable visual placeholder.
      return createFilledArray(shape, 0);
    }

    case "np.arange": {
      const start = toNumber(params.start, "Start");
      const stop = toNumber(params.stop, "Stop");
      const step = toNumber(params.step, "Step");

      return createArange(start, stop, step);
    }

    case "np.linspace": {
      const start = toNumber(params.start, "Start");
      const stop = toNumber(params.stop, "Stop");
      const count = toInteger(params.count, "Count");

      return createLinspace(start, stop, count);
    }

    case "np.eye": {
      const size = toInteger(params.size, "Size");

      if (size <= 0) {
        throw new Error("Size must be positive.");
      }

      return Array.from({ length: size }, (_, row) =>
        Array.from(
          { length: size },
          (_, column) => (row === column ? 1 : 0)
        )
      );
    }

    case "np.identity": {
      const size = toInteger(params.size, "Size");

      if (size <= 0) {
        throw new Error("Size must be positive.");
      }

      return Array.from({ length: size }, (_, row) =>
        Array.from(
          { length: size },
          (_, column) => (row === column ? 1 : 0)
        )
      );
    }

    case "np.diag": {
      const values = parseValues(params.values);

      return values.map((value, row) =>
        values.map(
          (_, column) => (row === column ? value : 0)
        )
      );
    }

    case "np.random.random": {
      const shape = parseShape(params.shape);

      return createRandomArray(
        shape,
        () => Number(rng().toFixed(6))
      );
    }

    case "np.random.rand": {
      const shape = parseShape(params.shape);

      return createRandomArray(
        shape,
        () => Number(rng().toFixed(6))
      );
    }

    case "np.random.randn": {
      const shape = parseShape(params.shape);

      return createRandomArray(
        shape,
        () => Number(normalRandom(0, 1, rng).toFixed(6))
      );
    }

    case "np.random.randint": {
      const low = toInteger(params.low, "Low");
      const high = toInteger(params.high, "High");
      const shape = parseShape(params.shape);

      if (high <= low) {
        throw new Error("High must be greater than Low.");
      }

      return createRandomArray(
        shape,
        () => Math.floor(rng() * (high - low)) + low
      );
    }

    case "np.random.uniform": {
      const low = toNumber(params.low, "Low");
      const high = toNumber(params.high, "High");
      const shape = parseShape(params.shape);

      if (high <= low) {
        throw new Error("High must be greater than Low.");
      }

      return createRandomArray(
        shape,
        () => Number(
          randomValue(low, high, rng).toFixed(6)
        )
      );
    }

    case "np.random.normal": {
      const loc = toNumber(params.loc, "Mean");
      const scale = toNumber(params.scale, "Std Dev");
      const shape = parseShape(params.shape);

      if (scale < 0) {
        throw new Error("Std Dev cannot be negative.");
      }

      return createRandomArray(
        shape,
        () => Number(
          normalRandom(loc, scale, rng).toFixed(6)
        )
      );
    }

    default:
      throw new Error(
        `Unsupported array creation function: ${functionName}`
      );
  }
}

/* -------------------------------------------------------
   CODE GENERATION
------------------------------------------------------- */

function formatShape(shapeValue) {
  const cleaned = String(shapeValue ?? "2, 3")
    .trim()
    .replace(/[()[\]]/g, "");

  const parts = cleaned
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return parts[0] || "5";
  }

  return `(${parts.join(", ")})`;
}

function formatSource(source) {
  try {
    const parsed = JSON.parse(source);

    return JSON.stringify(parsed, null, 2);
  } catch {
    return source;
  }
}

function buildSeedCode(params) {
  if (!params.useSeed) {
    return "";
  }

  const seed = params.seed ?? DEFAULT_CREATION_PARAMS.seed;
  const numericSeed = Number(seed);

  if (!Number.isInteger(numericSeed)) {
    throw new Error("Seed must be a whole number.");
  }

  return `np.random.seed(${numericSeed})`;
}

export function buildArrayCreationCode(
  functionName,
  params = {}
) {
  const p = {
    ...DEFAULT_CREATION_PARAMS,
    ...params,
  };

  switch (functionName) {
    case "np.array":
      return `import numpy as np

arr = np.array(${p.source})

print(arr)`;

    case "np.zeros":
      return `import numpy as np

arr = np.zeros(${formatShapeArg(p.shape)})

print(arr)`;

    case "np.ones":
      return `import numpy as np

arr = np.ones(${formatShapeArg(p.shape)})

print(arr)`;

    case "np.full":
      return `import numpy as np

arr = np.full(${formatShapeArg(p.shape)}, ${p.fillValue})

print(arr)`;

    case "np.empty":
      return `import numpy as np

arr = np.empty(${formatShapeArg(p.shape)})

print(arr)`;

    case "np.arange":
      return `import numpy as np

arr = np.arange(${p.start}, ${p.stop}, ${p.step})

print(arr)`;

    case "np.linspace":
      return `import numpy as np

arr = np.linspace(${p.start}, ${p.stop}, ${p.count})

print(arr)`;

    case "np.eye":
      return `import numpy as np

arr = np.eye(${p.size})

print(arr)`;

    case "np.identity":
      return `import numpy as np

arr = np.identity(${p.size})

print(arr)`;

    case "np.diag":
      return `import numpy as np

arr = np.diag([${p.values}])

print(arr)`;

    case "np.random.random":
      return `import numpy as np

${buildSeedCode(p)}

arr = np.random.random(${formatShapeArg(p.shape)})

print(arr)`;

    case "np.random.rand":
      return `import numpy as np

${buildSeedCode(p)}

arr = np.random.rand(${formatRandArgs(p.shape)})

print(arr)`;

    case "np.random.randn":
      return `import numpy as np

${buildSeedCode(p)}

arr = np.random.randn(${formatRandArgs(p.shape)})

print(arr)`;

    case "np.random.randint":
      return `import numpy as np

${buildSeedCode(p)}

arr = np.random.randint(${p.low}, ${p.high}, size=${formatShapeArg(
        p.shape
      )})

print(arr)`;

    case "np.random.uniform":
      return `import numpy as np

${buildSeedCode(p)}

arr = np.random.uniform(${p.low}, ${p.high}, size=${formatShapeArg(
        p.shape
      )})

print(arr)`;

    case "np.random.normal":
      return `import numpy as np

${buildSeedCode(p)}

arr = np.random.normal(${p.loc}, ${p.scale}, size=${formatShapeArg(
        p.shape
      )})

print(arr)`;

    default:
      return `import numpy as np

print(arr)`;
  }
}

function formatShapeArg(shapeText) {
  const raw = String(shapeText ?? "").trim();

  const parts = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return parts[0] || "1";
  }

  return `(${parts.slice(0, 3).join(", ")})`;
}

function formatRandArgs(shapeText) {
  const raw = String(shapeText ?? "").trim();

  return raw || "1";
}

export const createArray = generateArray;