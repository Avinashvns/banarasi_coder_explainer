import { useState } from "react";

import numpyModules from "../data/numpyCurriculum";
import moduleContent from "../data/moduleContent";
import { getArrayMetrics } from "../core/arrayEngine";
import { buildDynamicCode } from "../features/numpyCode";
import conceptData from "../features/conceptData";
import { parseAndValidateArray } from "../features/arrayValidation";

const DEFAULT_ARRAY = [
  [1, 2, 3],
  [4, 5, 6],
];

const DEFAULT_ARRAY_INPUT = "[[1, 2, 3], [4, 5, 6]]";

function getModuleVisualMode(moduleName) {
  return moduleName === "Indexing & Slicing"
    ? "indexing"
    : "shape";
}

export default function useNumpyExplainer() {
  const [activeModule, setActiveModule] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [visualMode, setVisualMode] = useState("shape");
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [arrayInput, setArrayInput] = useState(DEFAULT_ARRAY_INPUT);
  const [arrayError, setArrayError] = useState("");

  const currentModule = numpyModules[activeModule];
  const currentContent = moduleContent[currentModule.name];
  const metrics = getArrayMetrics(array);
  const dynamicCode = buildDynamicCode(currentModule.name, array);
  const activeConcept =
    conceptData[visualMode] ?? conceptData.shape;

  const handleModuleChange = (index) => {
    const module = numpyModules[index];

    setActiveModule(index);
    setSelectedCell(null);
    setVisualMode(getModuleVisualMode(module.name));
  };

  const handleConceptClick = (concept) => {
    setVisualMode(concept);
  };

  const handleCellClick = (cell) => {
    setSelectedCell(cell);
  };

  const handleApplyArray = () => {
    try {
      const parsedArray = parseAndValidateArray(arrayInput);

      setArray(parsedArray);
      setSelectedCell(null);
      setArrayError("");
    } catch (error) {
      setArrayError(
        error.message || "Invalid array."
      );
    }
  };

  return {
    activeModule,
    currentModule,
    currentContent,
    selectedCell,
    visualMode,
    array,
    arrayInput,
    arrayError,
    metrics,
    dynamicCode,
    activeConcept,
    setArrayInput,
    handleModuleChange,
    handleConceptClick,
    handleCellClick,
    handleApplyArray,
  };
}
