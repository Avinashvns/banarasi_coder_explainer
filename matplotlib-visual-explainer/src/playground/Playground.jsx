import { useState } from "react";

import DataControls from "./controls/DataControls";
import PlotSettings from "./settings/PlotSettings";
import ChartPreview from "./chart/ChartPreview";
import CodePreview from "./code/CodePreview";

import {
  DEFAULT_DATA,
  DEFAULT_STYLE,
} from "./data/defaultData";

import "./Playground.css";
import "./controls/Controls.css";
import "./settings/PlotSettings.css";
import "./chart/ChartPreview.css";
import "./code/CodePreview.css";

function Playground() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [settings, setSettings] = useState(DEFAULT_STYLE);

  return (
    <div className="playground">

      {/* TOP CONTROLS */}
      <div className="playground-controls">
        <DataControls
          data={data}
          setData={setData}
        />

        <PlotSettings
          settings={settings}
          setSettings={setSettings}
        />
      </div>

      {/* CHART + CODE */}
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

    </div>
  );
}

export default Playground;