import { useState } from "react";

import numpyModules from "../data/numpyCurriculum";
import moduleContent from "../data/moduleContent";
import { getArrayMetrics } from "../core/arrayEngine";

import { buildDynamicCode } from "../features/numpyCode";
import conceptData from "../features/conceptData";
import { parseAndValidateArray } from "../features/arrayValidation";
import { get3DArrayMetrics, is3DArray } from "../features/array3D";

import {
  generateArray,
  buildArrayCreationCode,
  DEFAULT_CREATION_FUNCTION,
  DEFAULT_CREATION_PARAMS,
} from "../features/arrayCreation";

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

  const [creationFunction, setCreationFunction] = useState(
    DEFAULT_CREATION_FUNCTION
  );

  const [creationParams, setCreationParams] = useState(
    DEFAULT_CREATION_PARAMS
  );

  const [creationError, setCreationError] = useState("");

  const currentModule = numpyModules[activeModule];
  const currentContent = moduleContent[currentModule.name];

  const metrics = is3DArray(array)
    ? get3DArrayMetrics(array)
    : getArrayMetrics(array);

  const dynamicCode =
    currentModule.name === "Array Creation"
      ? buildArrayCreationCode(creationFunction, creationParams)
      : buildDynamicCode(currentModule.name, array);

  const activeConcept =
    conceptData[visualMode] ?? conceptData.shape;

  const handleModuleChange = (index) => {
    const module = numpyModules[index];

    setActiveModule(index);
    setSelectedCell(null);
    setArrayError("");
    setCreationError("");
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

  const handleCreationFunctionChange = (functionName) => {
    setCreationFunction(functionName);
    setCreationError("");
    setSelectedCell(null);
  };

  const handleCreationParamChange = (name, value) => {
    setCreationParams((previous) => ({
      ...previous,
      [name]: value,
    }));

    setCreationError("");
  };

  const handleSeedToggle = (enabled) => {
    setCreationParams((previous) => ({
      ...previous,
      useSeed: enabled,
    }));

    setCreationError("");
  };

  const handleGenerateArray = () => {
    try {
      const generatedArray = generateArray(
        creationFunction,
        creationParams
      );

      setArray(generatedArray);
      setSelectedCell(null);
      setCreationError("");
      setArrayError("");

      if (creationFunction === "np.array") {
        setArrayInput(creationParams.source);
      }
    } catch (error) {
      setCreationError(
        error.message || "Unable to generate array."
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

    creationFunction,
    creationParams,
    creationError,

    setArrayInput,
    handleModuleChange,
    handleConceptClick,
    handleCellClick,
    handleApplyArray,

    handleCreationFunctionChange,
    handleCreationParamChange,
    handleGenerateArray,
    handleSeedToggle,
  };
}
