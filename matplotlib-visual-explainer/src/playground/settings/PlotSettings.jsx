function PlotSettings({ settings, setSettings }) {
  const updateSetting = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <section className="plot-settings">
      <div className="settings-header">
        <h3>MATPLOTLIB SETTINGS</h3>
      </div>

      <div className="settings-grid">
        <label>
          Title
          <input
            value={settings.title}
            onChange={(e) =>
              updateSetting("title", e.target.value)
            }
          />
        </label>

        <label>
          X Label
          <input
            value={settings.xlabel}
            onChange={(e) =>
              updateSetting("xlabel", e.target.value)
            }
          />
        </label>

        <label>
          Y Label
          <input
            value={settings.ylabel}
            onChange={(e) =>
              updateSetting("ylabel", e.target.value)
            }
          />
        </label>

        <label>
          Line Width
          <input
            type="number"
            min="1"
            max="10"
            value={settings.lineWidth}
            onChange={(e) =>
              updateSetting(
                "lineWidth",
                Number(e.target.value)
              )
            }
          />
        </label>
      </div>
    </section>
  );
}

export default PlotSettings;