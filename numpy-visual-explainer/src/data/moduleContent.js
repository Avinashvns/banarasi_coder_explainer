const moduleContent = {
  "Array Fundamentals": {
    title: "NumPy Array",
    subtitle: "See how data becomes a NumPy array",

    code: `import numpy as np

arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])`,

    array: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  "Array Creation": {
    title: "Array Creation",
    subtitle: "Create arrays and see the structure",

    code: `import numpy as np

arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])`,

    array: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  "Data Types": {
    title: "Data Types",
    subtitle: "See how NumPy stores values",

    code: `import numpy as np

arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
], dtype=np.int32)`,

    array: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  "Indexing & Slicing": {
    title: "Indexing & Slicing",
    subtitle: "Select elements directly from the array",

    code: `import numpy as np

arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

value = arr[0, 1]`,

    array: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  "NumPy Operations": {
    title: "NumPy Operations",
    subtitle: "Change values through operations",

    code: `import numpy as np

arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

result = arr + 10`,

    array: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  "Mathematical Functions": {
    title: "Mathematical Functions",
    subtitle: "Apply mathematical functions visually",

    code: `import numpy as np

arr = np.array([
    [1, 4, 9],
    [16, 25, 36]
])

result = np.sqrt(arr)`,

    array: [
      [1, 4, 9],
      [16, 25, 36],
    ],
  },

  "Aggregation & Statistics": {
    title: "Aggregation & Statistics",
    subtitle: "See how values are combined",

    code: `import numpy as np

arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

result = np.sum(arr)`,

    array: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  "Reshaping & Dimensions": {
    title: "Reshaping & Dimensions",
    subtitle: "Change the structure without changing the data",

    code: `import numpy as np

arr = np.array([1, 2, 3, 4, 5, 6])

result = arr.reshape(2, 3)`,

    array: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  Broadcasting: {
    title: "Broadcasting",
    subtitle: "See how NumPy matches different shapes",

    code: `import numpy as np

A = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

B = np.array([10, 20, 30])

result = A + B`,

    array: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  "Joining & Stacking": {
    title: "Joining & Stacking",
    subtitle: "Combine arrays visually",

    code: `import numpy as np

A = np.array([1, 2, 3])
B = np.array([4, 5, 6])

result = np.concatenate([A, B])`,

    array: [
      [1, 2, 3],
      [4, 5, 6],
    ],
  },

  "Copy, View & Memory": {
    title: "Copy, View & Memory",
    subtitle: "See how arrays share or copy data",

    code: `import numpy as np

arr = np.array([1, 2, 3])

copy = arr.copy()`,

    array: [
      [1, 2, 3],
    ],
  },

  "Searching & Sorting": {
    title: "Searching & Sorting",
    subtitle: "Find and organize values visually",

    code: `import numpy as np

arr = np.array([5, 2, 8, 1, 4])

result = np.sort(arr)`,

    array: [
      [5, 2, 8, 1, 4],
    ],
  },

  "Linear Algebra": {
    title: "Linear Algebra",
    subtitle: "Visualize vectors and matrices",

    code: `import numpy as np

A = np.array([
    [1, 2],
    [3, 4]
])

result = A @ A`,

    array: [
      [1, 2],
      [3, 4],
    ],
  },
};

export default moduleContent;