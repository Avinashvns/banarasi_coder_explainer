import "./index.css";

import numpyModules from "./data/numpyCurriculum";

import useNumpyExplainer from "./hooks/useNumpyExplainer";

import Header from "./components/Header";
import InputColumn from "./components/InputColumn";
import ArrayPlayground from "./components/ArrayPlayground";
import ArrayInspector from "./components/ArrayInspector";

function App() {
  const {
    activeModule,
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
  } = useNumpyExplainer();

  return (
    <div className="app">
      <Header
        modules={numpyModules}
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
      />

      <main className="main-grid">
        <InputColumn
          arrayInput={arrayInput}
          onArrayInputChange={setArrayInput}
          onApplyArray={handleApplyArray}
          arrayError={arrayError}
          code={dynamicCode}
        />

        <ArrayPlayground
          array={array}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
          visualMode={visualMode}
          activeConcept={activeConcept}
          metrics={metrics}
        />

        <ArrayInspector
          metrics={metrics}
          visualMode={visualMode}
          onConceptClick={handleConceptClick}
          selectedCell={selectedCell}
        />
      </main>
    </div>
  );
}

export default App;
