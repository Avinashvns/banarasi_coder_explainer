import { useState } from "react";

import DataControls from "./controls/DataControls";
import PlotSettings from "./settings/PlotSettings";
import IntroductionControls from "./controls/IntroductionControls";

import IntroductionContent from "./introduction/IntroductionContent";

import ChartPreview from "./chart/ChartPreview";
import CodePreview from "./code/CodePreview";
import IntroductionVisual from "./introduction/IntroductionVisual";
import BasicLinePlotControls from "./controls/BasicLinePlotControls";
import PlotStyling from "./controls/plotStyling/PlotStyling";

import {
  DEFAULT_DATA,
  DEFAULT_STYLE,
} from "./data/defaultData";

import "./Playground.css";
import "./controls/Controls.css";
import "./settings/PlotSettings.css";
import "./chart/ChartPreview.css";
import "./code/CodePreview.css";
import "./introduction/Introduction.css";
import "./controls/plotStyling/PlotStyling.css";


function Playground({ selectedModule }) {

  /* ========================================
     BASIC LINE PLOT STATE
  ======================================== */

  const [basicData, setBasicData] =
    useState(DEFAULT_DATA);

  const [basicSettings, setBasicSettings] =
    useState(DEFAULT_STYLE);


  /* ========================================
     PLOT STYLING STATE
     Completely independent from Basic Line Plot
  ======================================== */

  const [stylingData, setStylingData] =
    useState(DEFAULT_DATA);

  const [stylingSettings, setStylingSettings] =
    useState(DEFAULT_STYLE);


  /* ========================================
     INTRODUCTION STATE
  ======================================== */

  const [selectedTopic, setSelectedTopic] =
    useState("matplotlib");


  /* ========================================
     CONTROLS
  ======================================== */

  const renderControls = () => {

    /* ----------------------------------------
       INTRODUCTION
    ---------------------------------------- */

    if (selectedModule === "Introduction") {
      return (
        <IntroductionControls
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
      );
    }


    /* ----------------------------------------
       BASIC LINE PLOT
    ---------------------------------------- */

    if (selectedModule === "Basic Line Plot") {
      return (
        <BasicLinePlotControls
          data={basicData}
          setData={setBasicData}
          settings={basicSettings}
          setSettings={setBasicSettings}
        />
      );
    }


    /* ----------------------------------------
       PLOT STYLING
    ---------------------------------------- */

    if (selectedModule === "Plot Styling") {
      return (
        <PlotStyling
          data={stylingData}
          setData={setStylingData}
          settings={stylingSettings}
          setSettings={setStylingSettings}
        />
      );
    }


    /* ----------------------------------------
       OTHER MODULES
    ---------------------------------------- */

    return (
      <>
        <DataControls
          data={basicData}
          setData={setBasicData}
        />

        <PlotSettings
          settings={basicSettings}
          setSettings={setBasicSettings}
        />
      </>
    );
  };


  /* ========================================
     ACTIVE PLAYGROUND STATE
  ======================================== */

  const activeData =
    selectedModule === "Plot Styling"
      ? stylingData
      : basicData;

  const activeSettings =
    selectedModule === "Plot Styling"
      ? stylingSettings
      : basicSettings;

  const activeSetData =
    selectedModule === "Plot Styling"
      ? setStylingData
      : setBasicData;

  const activeSetSettings =
    selectedModule === "Plot Styling"
      ? setStylingSettings
      : setBasicSettings;


  /* ========================================
     UI
  ======================================== */

  return (
    <div className="playground">

      {/* ====================================
          TOP CONTROLS
      ==================================== */}

      <div className="playground-controls">
        {renderControls()}
      </div>


      {/* ====================================
          INTRODUCTION VISUAL
      ==================================== */}

      {selectedModule === "Introduction" &&
        ![
          "matplotlib",
          "why",
          "pyplot",
          "import",
        ].includes(selectedTopic) && (

          <div className="introduction-learning-row">

            <IntroductionContent
              selectedTopic={selectedTopic}
            />

            <IntroductionVisual
              selectedTopic={selectedTopic}
            />

          </div>
        )}


      {selectedModule === "Introduction" &&
        [
          "matplotlib",
          "why",
          "pyplot",
          "import",
        ].includes(selectedTopic) && (

          <IntroductionContent
            selectedTopic={selectedTopic}
          />
        )}


      {/* ====================================
          CHART + CODE
      ==================================== */}

      {selectedModule !== "Introduction" && (

        <div className="playground-visual">

          <ChartPreview
            data={activeData}
            style={activeSettings}
          />

          <CodePreview
            data={activeData}
            style={activeSettings}
            setData={activeSetData}
            setSettings={activeSetSettings}
          />

        </div>
      )}

    </div>
  );
}

export default Playground;