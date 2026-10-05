export function getShape(array) {
  if (!Array.isArray(array)) {
    return [];
  }

  if (!Array.isArray(array[0])) {
    return [array.length];
  }

  return [array.length, array[0].length];
}

export function getNdim(array) {
  if (!Array.isArray(array)) {
    return 0;
  }

  if (!Array.isArray(array[0])) {
    return 1;
  }

  return 2;
}

export function getSize(array) {
  if (!Array.isArray(array)) {
    return 0;
  }

  if (!Array.isArray(array[0])) {
    return array.length;
  }

  return array.length * array[0].length;
}

export function getDtype(array) {
  const values = Array.isArray(array[0])
    ? array.flat()
    : array;

  if (values.length === 0) {
    return "unknown";
  }

  const allNumbers = values.every(
    (value) => typeof value === "number"
  );

  if (!allNumbers) {
    return "object";
  }

  const allIntegers = values.every(
    (value) => Number.isInteger(value)
  );

  return allIntegers ? "int64" : "float64";
}

export function getAxis(array) {
  const ndim = getNdim(array);

  if (ndim === 1) {
    return ["axis 0"];
  }

  if (ndim === 2) {
    return ["axis 0", "axis 1"];
  }

  return [];
}

export function getArrayMetrics(array) {
  return {
    shape: getShape(array),
    ndim: getNdim(array),
    size: getSize(array),
    dtype: getDtype(array),
    axis: getAxis(array),
  };
}