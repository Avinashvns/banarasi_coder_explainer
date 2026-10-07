function StyleControls({ style, setStyle }) {
  return (
    <div className="control-section">
      <h3>STYLE</h3>
      <label>
        Title
        <input value={style.title} onChange={(e) => setStyle({ ...style, title: e.target.value })} />
      </label>
      <label>
        X Label
        <input value={style.xlabel} onChange={(e) => setStyle({ ...style, xlabel: e.target.value })} />
      </label>
      <label>
        Y Label
        <input value={style.ylabel} onChange={(e) => setStyle({ ...style, ylabel: e.target.value })} />
      </label>
    </div>
  );
}

export default StyleControls;
