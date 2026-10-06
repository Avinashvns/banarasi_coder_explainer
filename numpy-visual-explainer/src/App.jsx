import "./index.css";

import numpyModules from "./data/numpyCurriculum";

import useNumpyExplainer from "./hooks/useNumpyExplainer";

import Header from "./components/Header";
import InputColumn from "./components/InputColumn";
import ArrayCreationPanel from "./components/ArrayCreationPanel";
import ArrayPlayground from "./components/ArrayPlayground";
import ArrayInspector from "./components/ArrayInspector";

function CreationCodePanel({ code }) {
  return (
    <section className="code-panel input-code-panel">
      <div className="column-title">NUMPY CODE</div>
      <pre>{code}</pre>
    </section>
  );
}

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
    handleSeedToggle,
    handleGenerateArray,
  } = useNumpyExplainer();

  const isArrayCreation =
    numpyModules[activeModule]?.name === "Array Creation";

  return (
    <div className="app">
      <Header
        modules={numpyModules}
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
      />

      <main className="main-grid">
        <section className="input-column">
          {isArrayCreation ? (
            <>
              <ArrayCreationPanel
                functionName={creationFunction}
                params={creationParams}
                error={creationError}
                onFunctionChange={handleCreationFunctionChange}
                onParamChange={handleCreationParamChange}
                onSeedToggle={handleSeedToggle}
                onGenerate={handleGenerateArray}
              />

              <CreationCodePanel code={dynamicCode} />
            </>
          ) : (
            <InputColumn
              arrayInput={arrayInput}
              onArrayInputChange={setArrayInput}
              onApplyArray={handleApplyArray}
              arrayError={arrayError}
              code={dynamicCode}
            />
          )}
        </section>

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
