function formatArrayForNumpy(array, indent = 0) {
  if (!Array.isArray(array)) {
    return String(array);
  }

  if (!Array.isArray(array[0])) {
    return `[${array.join(", ")}]`;
  }

  const spaces = " ".repeat(indent);

  const rows = array.map((row) => {
    return `${spaces}    [${row.join(", ")}]`;
  });

  return `[\n${rows.join(",\n")}\n${spaces}]`;
}

export function buildDynamicCode(moduleName, array) {
  const arrayCode = formatArrayForNumpy(array);

  switch (moduleName) {
    case "Array Fundamentals":
      return `import numpy as np

arr = np.array(${arrayCode})
print(arr)
print(arr.shape)
print(arr.ndim)
print(arr.size)
print(arr.dtype)`;

    case "Array Creation":
      return `import numpy as np

arr = np.array(${arrayCode})`;

    case "Data Types":
      return `import numpy as np

arr = np.array(${arrayCode}, dtype=np.int32)`;

    case "Indexing & Slicing": {
      const indexExpression = Array.isArray(array[0])
        ? "arr[0, 1]"
        : "arr[1]";

      return `import numpy as np

arr = np.array(${arrayCode})
value = ${indexExpression}`;
    }

    case "NumPy Operations":
      return `import numpy as np

arr = np.array(${arrayCode})
result = arr + 10`;

    case "Mathematical Functions":
      return `import numpy as np

arr = np.array(${arrayCode})
result = np.sqrt(arr)`;

    case "Aggregation & Statistics":
      return `import numpy as np

arr = np.array(${arrayCode})
result = np.sum(arr)`;

    case "Reshaping & Dimensions":
      return `import numpy as np

arr = np.array(${arrayCode})
result = arr.reshape(2, 3)`;

    case "Broadcasting":
      return `import numpy as np

A = np.array(${arrayCode})
B = np.array([10, 20, 30])
result = A + B`;

    case "Joining & Stacking":
      return `import numpy as np

A = np.array(${arrayCode})
B = np.array([4, 5, 6])
result = np.concatenate([A, B])`;

    case "Copy, View & Memory":
      return `import numpy as np

arr = np.array(${arrayCode})
copy = arr.copy()`;

    case "Searching & Sorting":
      return `import numpy as np

arr = np.array(${arrayCode})
result = np.sort(arr)`;

    case "Linear Algebra":
      return `import numpy as np

A = np.array(${arrayCode})
result = A @ A`;

    default:
      return `import numpy as np

arr = np.array(${arrayCode})`;
  }
}
