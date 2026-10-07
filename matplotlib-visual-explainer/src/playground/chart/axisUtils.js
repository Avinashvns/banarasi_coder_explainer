/* ========================================
   AXIS UTILITIES
======================================== */

const NICE_FACTORS = [1, 2, 5, 10];


/* ========================================
   NICE STEP
======================================== */

function getNiceStep(range, targetTicks = 7) {
  if (!Number.isFinite(range) || range <= 0) {
    return 1;
  }

  const rawStep = range / Math.max(targetTicks - 1, 1);

  const magnitude =
    10 ** Math.floor(Math.log10(rawStep));

  const normalized = rawStep / magnitude;

  let factor = 10;

  for (const value of NICE_FACTORS) {
    if (normalized <= value) {
      factor = value;
      break;
    }
  }

  return factor * magnitude;
}


/* ========================================
   DECIMAL PRECISION
======================================== */

function getPrecision(step) {
  if (!Number.isFinite(step) || step === 0) {
    return 0;
  }

  const exponent =
    Math.floor(Math.log10(Math.abs(step)));

  return Math.max(0, -exponent);
}


/* ========================================
   FORMAT AXIS VALUE
======================================== */

export function formatAxisValue(value, step = 1) {
  if (!Number.isFinite(value)) {
    return "";
  }

  const absolute = Math.abs(value);

  /* Large values */

  if (absolute >= 1_000_000_000) {
    return `${(value / 1_000_000_000)
      .toFixed(1)
      .replace(/\.0$/, "")}B`;
  }

  if (absolute >= 1_000_000) {
    return `${(value / 1_000_000)
      .toFixed(1)
      .replace(/\.0$/, "")}M`;
  }

  if (absolute >= 10_000) {
    return `${(value / 1_000)
      .toFixed(1)
      .replace(/\.0$/, "")}K`;
  }

  if (absolute >= 1_000) {
    return `${(value / 1_000)
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1")}K`;
  }

  /* Normal / decimal values */

  const precision = getPrecision(step);

  if (precision === 0) {
    return String(Math.round(value));
  }

  return value
    .toFixed(precision)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}

/* ========================================
   NUMERIC AXIS
======================================== */

export function getNiceAxis(
  values,
  targetTicks = 7
) {
  const numericValues = values
    .map(Number)
    .filter(Number.isFinite);

  if (numericValues.length === 0) {
    return {
      min: 0,
      max: 1,
      step: 1,
      ticks: [0, 1],
    };
  }

  let dataMin = Math.min(...numericValues);
  let dataMax = Math.max(...numericValues);

  /* Same-value data */

  if (dataMin === dataMax) {
    const base =
      Math.abs(dataMin) || 1;

    const step =
      getNiceStep(base, targetTicks);

    dataMin -= step;
    dataMax += step;
  }

  const dataRange = dataMax - dataMin;

  const step = getNiceStep(
    dataRange,
    targetTicks
  );

  /*
   * Nice boundaries.
   *
   * Small padding is naturally created
   * by rounding to the nearest nice step.
   */

  let min =
    Math.floor(dataMin / step) * step;

  let max =
    Math.ceil(dataMax / step) * step;

  if (min === max) {
    max = min + step;
  }

  /*
   * Prevent floating-point errors.
   */

  const precision =
    getPrecision(step);

  min = Number(min.toFixed(precision + 2));
  max = Number(max.toFixed(precision + 2));

  const ticks = [];

  const maxTicks = 12;

  for (
    let value = min;
    value <= max + step * 0.000001;
    value += step
  ) {
    const cleanValue =
      Number(value.toFixed(precision + 2));

    ticks.push(cleanValue);

    if (ticks.length >= maxTicks) {
      break;
    }
  }

  return {
    min,
    max,
    step,
    ticks,
  };
}


/* ========================================
   CATEGORICAL TICKS
======================================== */

export function getCategoricalTicks(
  values,
  maxTicks = 8
) {
  if (values.length === 0) {
    return [];
  }

  if (values.length <= maxTicks) {
    return values.map((value, index) => ({
      value,
      index,
    }));
  }

  const ticks = [];

  const step =
    (values.length - 1) /
    (maxTicks - 1);

  for (let i = 0; i < maxTicks; i++) {
    const index = Math.round(i * step);

    ticks.push({
      value: values[index],
      index,
    });
  }

  return ticks;
}