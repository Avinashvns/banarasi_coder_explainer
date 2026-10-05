export function parseAndValidateArray(input) {
  const parsedArray = JSON.parse(input);

  if (!Array.isArray(parsedArray)) {
    throw new Error("Input must be an array.");
  }

  if (parsedArray.length === 0) {
    throw new Error("Array cannot be empty.");
  }

  const isNested = Array.isArray(parsedArray[0]);

  if (isNested) {
    const columnCount = parsedArray[0].length;

    if (columnCount === 0) {
      throw new Error("Array cannot contain empty rows.");
    }

    const isValid2D = parsedArray.every(
      (row) =>
        Array.isArray(row) &&
        row.length === columnCount
    );

    if (!isValid2D) {
      throw new Error(
        "All rows must have the same number of columns."
      );
    }
  } else {
    const containsNestedArray = parsedArray.some(
      (item) => Array.isArray(item)
    );

    if (containsNestedArray) {
      throw new Error("Invalid array structure.");
    }
  }

  return parsedArray;
}
