function DataControls({ data, setData }) {
  const updateData = (key, value) => {
    const values = value
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => !Number.isNaN(item));

    setData({
      ...data,
      [key]: values,
    });
  };

  return (
    <div className="data-controls">
      <span className="control-title">DATA</span>

      <label className="data-field">
        X
        <input
          type="text"
          value={data.x.join(",")}
          onChange={(e) => updateData("x", e.target.value)}
        />
      </label>

      <label className="data-field">
        Y
        <input
          type="text"
          value={data.y.join(",")}
          onChange={(e) => updateData("y", e.target.value)}
        />
      </label>
    </div>
  );
}

export default DataControls;