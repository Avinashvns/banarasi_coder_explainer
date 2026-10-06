function getShapeRecursive(value) {
  if (!Array.isArray(value)) return [];
  if (value.length === 0) return [0];

  const childShape = getShapeRecursive(value[0]);

  for (let index = 1; index < value.length; index += 1) {
    const nextShape = getShapeRecursive(value[index]);

    if (
      nextShape.length !== childShape.length ||
      nextShape.some((size, axis) => size !== childShape[axis])
    ) {
      throw new Error("3D array must be rectangular.");
    }
  }

  return [value.length, ...childShape];
}

function findFirstScalar(value) {
  return Array.isArray(value) ? findFirstScalar(value[0]) : value;
}

function getDtype(value) {
  const sample = findFirstScalar(value);

  if (typeof sample !== "number" || Number.isNaN(sample)) {
    return "object";
  }

  return Number.isInteger(sample) ? "int64" : "float64";
}

export function get3DArrayMetrics(array) {
  const shape = getShapeRecursive(array);

  if (shape.length !== 3) {
    throw new Error("Expected a 3D array.");
  }

  return {
    shape,
    ndim: 3,
    size: shape.reduce((total, size) => total * size, 1),
    dtype: getDtype(array),
    axis: [0, 1, 2],
  };
}

export function is3DArray(array) {
  return (
    Array.isArray(array) &&
    Array.isArray(array[0]) &&
    Array.isArray(array[0]?.[0])
  );
}
