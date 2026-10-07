function StyleControls({
  data,
  setData,
  settings,
  setSettings,
}) {
  /* ========================================
     DATA UPDATE
  ======================================== */

  const updateData = (key, value) => {
    const values = value
      .split(",")
      .map((item) => Number(item.trim()))
      .filter(
        (item) => !Number.isNaN(item)
      );

    setData((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  /* ========================================
     SETTINGS UPDATE
  ======================================== */

  const update = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="plot-styling-controls">

      {/* ====================================
          DATA
      ==================================== */}

      <div className="control-section styling-data-section">

        <div className="control-section-title">
          DATA
        </div>

        <div className="control-row">
          <label>X DATA</label>

          <input
            type="text"
            value={data.x.join(", ")}
            onChange={(e) =>
              updateData(
                "x",
                e.target.value
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
              )
            }
          />
        </div>

      </div>

      {/* ====================================
          MATPLOTLIB SETTINGS
      ==================================== */}

      <div className="control-section styling-settings-section">

        <div className="control-section-title">
          MATPLOTLIB SETTINGS
        </div>

        <div className="control-row">
          <label>TITLE</label>

          <input
            type="text"
            value={settings.title}
            onChange={(e) =>
              update(
                "title",
                e.target.value
              )
            }
          />
        </div>

        <div className="control-row">
          <label>X LABEL</label>

          <input
            type="text"
            value={settings.xlabel}
            onChange={(e) =>
              update(
                "xlabel",
                e.target.value
              )
            }
          />
        </div>

        <div className="control-row">
          <label>Y LABEL</label>

          <input
            type="text"
            value={settings.ylabel}
            onChange={(e) =>
              update(
                "ylabel",
                e.target.value
              )
            }
          />
        </div>

      </div>

      {/* ====================================
          LINE
      ==================================== */}

      <div className="control-section styling-line-section">

        <div className="control-section-title">
          LINE
        </div>

        <div className="control-row">
          <label>COLOR</label>

          {/* COLOR PICKER */}
          <input
            type="color"
            value={settings.color}
            onChange={(e) =>
              update("color", e.target.value)
            }
            className="color-input"
          />

          {/* COLOR NAME INPUT */}
          <input
            type="text"
            value={settings.color || ""}
            onChange={(e) =>
              update("color", e.target.value)
            }
            className="color-text-input"
            placeholder="green"
          />
        </div>

        <div className="control-row">
          <label>WIDTH</label>

          <input
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={settings.lineWidth}
            onChange={(e) =>
              update(
                "lineWidth",
                Number(e.target.value)
              )
            }
          />
        </div>

        {/* LINE STYLE */}

        <div className="control-row">

          <label>STYLE</label>

          <select
            value={settings.lineStyle}
            onChange={(e) =>
              update(
                "lineStyle",
                e.target.value
              )
            }
          >
            <option value="-">
              Solid
            </option>

            <option value="--">
              Dashed
            </option>

            <option value=":">
              Dotted
            </option>

            <option value="-.">
              Dash-dot
            </option>
          </select>

        </div>

      </div>

      {/* ====================================
          MARKER
      ==================================== */}

      <div className="control-section styling-marker-section">

        <div className="control-section-title">
          MARKER
        </div>

        {/* MARKER */}

        <div className="control-row">

          <label>MARKER</label>

          <select
            value={settings.marker}
            onChange={(e) =>
              update(
                "marker",
                e.target.value
              )
            }
          >
            <option value="">
              None
            </option>

            <option value="o">
              Circle
            </option>

            <option value="s">
              Square
            </option>

            <option value="^">
              Triangle
            </option>

            <option value="D">
              Diamond
            </option>

            <option value="+">
              Plus
            </option>

            <option value="*">
              Star
            </option>
          </select>

        </div>

        {/* SIZE */}

        <div className="control-row">

          <label>SIZE</label>

          <input
            type="number"
            min="1"
            max="20"
            value={settings.markerSize}
            onChange={(e) =>
              update(
                "markerSize",
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>

        {/* EDGE + FACE */}

        <div className="control-row-pair">

          <div className="control-row">

            <label>EDGE</label>

            <input
              type="color"
              value={
                settings.markerEdgeColor
              }
              onChange={(e) =>
                update(
                  "markerEdgeColor",
                  e.target.value
                )
              }
              className="color-input"
            />

          </div>

          <div className="control-row">

            <label>FACE</label>

            <input
              type="color"
              value={
                settings.markerFaceColor
              }
              onChange={(e) =>
                update(
                  "markerFaceColor",
                  e.target.value
                )
              }
              className="color-input"
            />

          </div>

        </div>

      </div>

      {/* ====================================
          APPEARANCE
      ==================================== */}

      <div className="control-section styling-appearance-section">

        <div className="control-section-title">
          APPEARANCE
        </div>

        {/* ALPHA */}

        <div className="control-row">

          <label>ALPHA</label>

          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={settings.alpha}
            onChange={(e) =>
              update(
                "alpha",
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>

        {/* FORMAT */}

        <div className="control-row">

          <label>FORMAT</label>

          <select
            value={settings.formatString}
            onChange={(e) =>
              update(
                "formatString",
                e.target.value
              )
            }
          >

            <option value="">
              None
            </option>

            {/* BLUE */}

            <option value="b-">
              Blue Solid
            </option>

            <option value="b--">
              Blue Dashed
            </option>

            <option value="b:">
              Blue Dotted
            </option>

            <option value="b-.">
              Blue Dash-dot
            </option>

            <option value="bo-">
              Blue Circle Solid
            </option>

            <option value="bo--">
              Blue Circle Dashed
            </option>

            <option value="bo:">
              Blue Circle Dotted
            </option>

            <option value="bo-.">
              Blue Circle Dash-dot
            </option>

            {/* GREEN */}

            <option value="g-">
              Green Solid
            </option>

            <option value="g--">
              Green Dashed
            </option>

            <option value="g:">
              Green Dotted
            </option>

            <option value="g-.">
              Green Dash-dot
            </option>

            <option value="go-">
              Green Circle Solid
            </option>

            <option value="go--">
              Green Circle Dashed
            </option>

            <option value="go:">
              Green Circle Dotted
            </option>

            <option value="go-.">
              Green Circle Dash-dot
            </option>

            <option value="g^-">
              Green Triangle Solid
            </option>

            <option value="g^--">
              Green Triangle Dashed
            </option>

            <option value="g^:">
              Green Triangle Dotted
            </option>

            {/* RED */}

            <option value="r-">
              Red Solid
            </option>

            <option value="r--">
              Red Dashed
            </option>

            <option value="r:">
              Red Dotted
            </option>

            <option value="r-.">
              Red Dash-dot
            </option>

            <option value="ro-">
              Red Circle Solid
            </option>

            <option value="ro--">
              Red Circle Dashed
            </option>

            <option value="ro:">
              Red Circle Dotted
            </option>

            <option value="ro-.">
              Red Circle Dash-dot
            </option>

            <option value="r^-">
              Red Triangle Solid
            </option>

            <option value="r^--">
              Red Triangle Dashed
            </option>

            <option value="r^:">
              Red Triangle Dotted
            </option>

            <option value="rs-">
              Red Square Solid
            </option>

            <option value="rs--">
              Red Square Dashed
            </option>

            <option value="rs:">
              Red Square Dotted
            </option>

            {/* CYAN */}

            <option value="c-">
              Cyan Solid
            </option>

            <option value="c--">
              Cyan Dashed
            </option>

            <option value="c:">
              Cyan Dotted
            </option>

            <option value="co-">
              Cyan Circle Solid
            </option>

            <option value="co--">
              Cyan Circle Dashed
            </option>

            {/* MAGENTA */}

            <option value="m-">
              Magenta Solid
            </option>

            <option value="m--">
              Magenta Dashed
            </option>

            <option value="m:">
              Magenta Dotted
            </option>

            <option value="mo-">
              Magenta Circle Solid
            </option>

            <option value="mo--">
              Magenta Circle Dashed
            </option>

            <option value="m*-">
              Magenta Star Solid
            </option>

            <option value="m*--">
              Magenta Star Dashed
            </option>

            {/* YELLOW */}

            <option value="y-">
              Yellow Solid
            </option>

            <option value="y--">
              Yellow Dashed
            </option>

            <option value="y:">
              Yellow Dotted
            </option>

            <option value="yo-">
              Yellow Circle Solid
            </option>

            <option value="yo--">
              Yellow Circle Dashed
            </option>

            {/* BLACK */}

            <option value="k-">
              Black Solid
            </option>

            <option value="k--">
              Black Dashed
            </option>

            <option value="k:">
              Black Dotted
            </option>

            <option value="ko-">
              Black Circle Solid
            </option>

            <option value="ko--">
              Black Circle Dashed
            </option>

            <option value="kD-">
              Black Diamond Solid
            </option>

            <option value="kD--">
              Black Diamond Dashed
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}

export default StyleControls;