function NumpyCodePanel({ code }) {
  return (
    <section className="code-panel input-code-panel">
      <div className="column-title">NUMPY CODE</div>
      <pre>{code}</pre>
    </section>
  );
}

export default NumpyCodePanel;
