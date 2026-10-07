function BasicLinePlotControls({
  data,
  setData,
  settings,
  setSettings,
}) {
  const updateData = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSettings = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="basic-line-controls">

      {/* =========================================
          DATA SECTION
      ========================================= */}

      <div className="control-section data-section">

        <div className="control-row">
          <label>X DATA</label>

          <input
            type="text"
            value={data.x.join(", ")}
            onChange={(e) =>
              updateData(
                "x",
                e.target.value
                  .split(",")
                  .map((value) => Number(value.trim()))
                  .filter(
                    (value) => !Number.isNaN(value)
                  )
              )
            }
          />
        </div>

        <div className="control-row">
          <label>Y DATA</label>

          <input
            type="text"
            value={data.y.join(", ")}
            onChange={(e) =>
              updateData(
                "y",
                e.target.value
                  .split(",")
                  .map((value) => Number(value.trim()))
                  .filter(
                    (value) => !Number.isNaN(value)
                  )
              )
            }
          />
        </div>

      </div>


      {/* =========================================
          SETTINGS SECTION
      ========================================= */}

      <div className="control-section settings-section">

        <div className="control-row title-row">
          <label>TITLE</label>

          <input
            type="text"
            value={settings.title}
            onChange={(e) =>
              updateSettings(
                "title",
                e.target.value
              )
            }
          />
        </div>

        <div className="axis-row">

          <div className="control-row">
            <label>X-LABEL</label>

            <input
              type="text"
              value={settings.xlabel}
              onChange={(e) =>
                updateSettings(
                  "xlabel",
                  e.target.value
                )
              }
            />
          </div>

          <div className="control-row">
            <label>Y-LABEL</label>

            <input
              type="text"
              value={settings.ylabel}
              onChange={(e) =>
                updateSettings(
                  "ylabel",
                  e.target.value
                )
              }
            />
          </div>

        </div>

      </div>


      {/* =========================================
          STYLE SECTION
      ========================================= */}

      <div className="control-section style-section">

        <div className="control-row">
          <label>LINE WIDTH</label>

          <input
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={settings.lineWidth}
            onChange={(e) =>
              updateSettings(
                "lineWidth",
                Number(e.target.value)
              )
            }
          />
        </div>

        <div className="control-row control-checkbox">
          <label>SHOW GRID</label>

          <input
            type="checkbox"
            checked={settings.grid}
            onChange={(e) =>
              updateSettings(
                "grid",
                e.target.checked
              )
            }
          />
        </div>

      </div>

    </div>
  );
}

export default BasicLinePlotControls;