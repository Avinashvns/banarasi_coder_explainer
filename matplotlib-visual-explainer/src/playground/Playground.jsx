import { useState } from "react";

import DataControls from "./controls/DataControls";
import PlotSettings from "./settings/PlotSettings";
import IntroductionControls from "./controls/IntroductionControls";

import IntroductionContent from "./introduction/IntroductionContent";

import ChartPreview from "./chart/ChartPreview";
import CodePreview from "./code/CodePreview";
import IntroductionVisual from "./introduction/IntroductionVisual";
import BasicLinePlotControls from "./controls/BasicLinePlotControls";

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

function Playground({ selectedModule }) {
  const [data, setData] = useState(DEFAULT_DATA);
  const [settings, setSettings] =
    useState(DEFAULT_STYLE);

  const [selectedTopic, setSelectedTopic] =
    useState("matplotlib");

  const renderControls = () => {
    if (selectedModule === "Introduction") {
      return (
        <IntroductionControls
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
      );
    }

    if (selectedModule === "Basic Line Plot") {
      return (
        <BasicLinePlotControls
          data={data}
          setData={setData}
          settings={settings}
          setSettings={setSettings}
        />
      );
    }

    return (
      <>
        <DataControls
          data={data}
          setData={setData}
        />

        <PlotSettings
          settings={settings}
          setSettings={setSettings}
        />
      </>
    );
  };

  return (
    <div className="playground">

      {/* TOP CONTROLS */}
      <div className="playground-controls">
        {renderControls()}
      </div>

      {/* INTRODUCTION VISUAL */}
      {selectedModule === "Introduction" &&
        !["matplotlib", "why", "pyplot", "import"].includes(
          selectedTopic
        ) && (
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
        ["matplotlib", "why", "pyplot", "import"].includes(
          selectedTopic
        ) && (
          <IntroductionContent
            selectedTopic={selectedTopic}
          />
        )}

      {/* CHART + CODE */}
      {selectedModule !== "Introduction" && (
        <div className="playground-visual">

          <ChartPreview
            data={data}
            style={settings}
          />

          <CodePreview
            data={data}
            style={settings}
            setData={setData}
            setSettings={setSettings}
          />

        </div>
      )}

    </div>
  );
}

export default Playground;