import { useState } from "react";

import "./index.css";

import numpyModules from "./data/numpyCurriculum";

import moduleContent from "./data/moduleContent";

import ArrayGrid from "./components/ArrayGrid";

import ArrayInput from "./components/ArrayInput";

import { getArrayMetrics } from "./core/arrayEngine";



function formatArrayForNumpy(array, indent = 0) {

  if (!Array.isArray(array)) {

    return String(array);

  }



  if (!Array.isArray(array[0])) {

    return `[${array.join(", ")}]`;

  }



  const spaces = " ".repeat(indent);



  const rows = array.map((row) => {

    return `${spaces}    [${row.join(", ")}]`;

  });



  return `[\n${rows.join(",\n")}\n${spaces}]`;

}



function buildDynamicCode(moduleName, array) {

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



const conceptData = {

  shape: {

    title: "SHAPE",

    value: "shape",

    explanation: (metrics) =>

      `${metrics.shape[0]} rows × ${metrics.shape[1] ?? metrics.shape[0]} columns. Shape tells us the size of every dimension.`,

  },



  ndim: {

    title: "NDIM",

    value: "ndim",

    explanation: (metrics) =>

      `This array has ${metrics.ndim} dimension${metrics.ndim === 1 ? "" : "s"

      }. A row-and-column grid is a 2D array.`,

  },



  axis: {

    title: "AXIS",

    value: "axis",

    explanation: () =>

      "Axis 0 moves through rows ↓. Axis 1 moves through columns →.",

  },



  size: {

    title: "SIZE",

    value: "size",

    explanation: (metrics) => {

      const rows = metrics.shape[0];

      const columns =

        metrics.shape.length > 1

          ? metrics.shape[1]

          : metrics.shape[0];



      return `${rows} × ${columns} = ${metrics.size} total elements.`;

    },

  },



  dtype: {

    title: "DTYPE",

    value: "dtype",

    explanation: (metrics) =>

      `The current values are represented as ${metrics.dtype}. Dtype describes the type of data stored in the array.`,

  },


  indexing: {
    title: "INDEXING",
    value: "indexing",
    explanation: (metrics) =>
      metrics.ndim === 1
        ? "Click an element to see its 1D index. NumPy uses zero-based indexing: arr[index]."
        : "Click an element to see its 2D index. NumPy uses row and column positions: arr[row, column].",
  },

  "row-selection": {
    title: "ROW SELECTION",
    value: "row-selection",
    explanation: () =>
      "Click any cell in a row to highlight the complete row. The row index stays visible on the left.",
  },

  "column-selection": {
    title: "COLUMN SELECTION",
    value: "column-selection",
    explanation: () =>
      "Click any cell in a column to highlight the complete column. The column index stays visible above.",
  },

};



function App() {

  const [activeModule, setActiveModule] = useState(0);



  const [selectedCell, setSelectedCell] = useState(null);



  const [visualMode, setVisualMode] = useState("shape");



  const [array, setArray] = useState([

    [1, 2, 3],

    [4, 5, 6],

  ]);



  const [arrayInput, setArrayInput] = useState(

    "[[1, 2, 3], [4, 5, 6]]"

  );



  const [arrayError, setArrayError] = useState("");



  const currentModule = numpyModules[activeModule];



  const currentContent =

    moduleContent[currentModule.name];



  const metrics = getArrayMetrics(array);



  const dynamicCode = buildDynamicCode(

    currentModule.name,

    array

  );



  const activeConcept = conceptData[visualMode];



  const handleConceptClick = (concept) => {

    setVisualMode(concept);

  };



  const handleApplyArray = () => {

    try {

      const parsedArray = JSON.parse(arrayInput);



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

          throw new Error(

            "Array cannot contain empty rows."

          );

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



      setArray(parsedArray);

      setSelectedCell(null);

      setArrayError("");

    } catch (error) {

      setArrayError(

        error.message || "Invalid array."

      );

    }

  };



  return (

    <div className="app">

      <header className="topbar">

        <div className="brand">

          <div className="brand-icon">

            BC

          </div>



          <div className="brand-text">

            <h1>BANARASI CODER</h1>

            <span>NumPy Explainer</span>

          </div>

        </div>



        <nav className="module-nav">

          {numpyModules.map((module, index) => (

            <button

              key={module.name}

              className={`module-nav-item ${activeModule === index

                ? "active"

                : ""

                }`}

              onClick={() => {

                setActiveModule(index);
                setSelectedCell(null);
                setVisualMode(
                  module.name === "Indexing & Slicing"
                    ? "indexing"
                    : "shape"
                );

              }}

            >

              {module.name}

            </button>

          ))}

        </nav>

      </header>



      <main className="main-grid">

        {/* LEFT */}

        <section className="input-column">

          <div className="column-title">

            ARRAY INPUT

          </div>



          <ArrayInput

            value={arrayInput}

            onChange={setArrayInput}

            onApply={handleApplyArray}

            error={arrayError}

          />



          <section className="code-panel input-code-panel">

            <div className="column-title">

              NUMPY CODE

            </div>



            <pre>{dynamicCode}</pre>

          </section>

        </section>



        {/* CENTER */}

        <section className="playground-column">

          <div className="playground-header">

            <h2>ARRAY PLAYGROUND</h2>

          </div>



          <div className="playground">

            <ArrayGrid

              array={array}

              selectedCell={selectedCell}

              onCellClick={setSelectedCell}

              visualMode={visualMode}

            />



            <div className="visual-explanation">

              <div className="visual-explanation-title">

                {activeConcept.title}

              </div>



              <div className="visual-explanation-text">

                {activeConcept.explanation(metrics)}

              </div>

            </div>

          </div>

        </section>



        {/* RIGHT */}

        <aside className="right-column">

          <section className="inspector-panel">

            <div className="column-title">

              ARRAY INSPECTOR

            </div>



            <div className="metrics">

              <button

                type="button"

                className={`metric ${visualMode === "shape"

                  ? "metric-active"

                  : ""

                  }`}

                onClick={() =>

                  handleConceptClick("shape")

                }

              >

                <span>SHAPE</span>



                <strong>

                  ({metrics.shape.join(", ")})

                </strong>

              </button>



              <button

                type="button"

                className={`metric ${visualMode === "ndim"

                  ? "metric-active"

                  : ""

                  }`}

                onClick={() =>

                  handleConceptClick("ndim")

                }

              >

                <span>NDIM</span>



                <strong>

                  {metrics.ndim}

                </strong>

              </button>



              <button

                type="button"

                className={`metric ${visualMode === "axis"

                  ? "metric-active"

                  : ""

                  }`}

                onClick={() =>

                  handleConceptClick("axis")

                }

              >

                <span>AXIS</span>



                <strong>

                  {metrics.axis.join(" / ")}

                </strong>

              </button>



              <button

                type="button"

                className={`metric ${visualMode === "size"

                  ? "metric-active"

                  : ""

                  }`}

                onClick={() =>

                  handleConceptClick("size")

                }

              >

                <span>SIZE</span>



                <strong>

                  {metrics.size}

                </strong>

              </button>



              <button

                type="button"

                className={`metric ${visualMode === "dtype"

                  ? "metric-active"

                  : ""

                  }`}

                onClick={() =>

                  handleConceptClick("dtype")

                }

              >

                <span>DTYPE</span>



                <strong>

                  {metrics.dtype}

                </strong>

              </button>



              <button
                type="button"
                className={`metric ${visualMode === "indexing"
                  ? "metric-active"
                  : ""
                  }`}
                onClick={() =>
                  handleConceptClick("indexing")
                }
              >
                <span>INDEXING</span>
                <strong>
                  {metrics.ndim === 1 ? "1D" : "1D / 2D"}
                </strong>
              </button>

              <button
                type="button"
                className={`metric ${visualMode === "row-selection"
                  ? "metric-active"
                  : ""
                  }`}
                onClick={() =>
                  handleConceptClick("row-selection")
                }
              >
                <span>ROW</span>
                <strong>SELECT</strong>
              </button>

              <button
                type="button"
                className={`metric ${visualMode === "column-selection"
                  ? "metric-active"
                  : ""
                  }`}
                onClick={() =>
                  handleConceptClick("column-selection")
                }
              >
                <span>COLUMN</span>
                <strong>SELECT</strong>
              </button>

            </div>



            {selectedCell && (

              <div className="selected-cell-panel">

                <div className="selected-cell-title">

                  SELECTED CELL

                </div>



                <div className="selected-cell-info">

                  <div className="selected-cell-item">

                    <span>POSITION</span>



                    <strong>
                      {metrics.ndim === 1
                        ? `[${selectedCell.col}]`
                        : `[${selectedCell.row}, ${selectedCell.col}]`}
                    </strong>

                  </div>



                  <div className="selected-cell-item">

                    <span>VALUE</span>



                    <strong>

                      {String(

                        selectedCell.value

                      )}

                    </strong>

                  </div>

                </div>

              </div>

            )}

          </section>

        </aside>

      </main>

    </div>

  );

}



export default App;
