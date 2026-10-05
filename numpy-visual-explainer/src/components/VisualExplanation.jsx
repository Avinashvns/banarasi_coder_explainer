function VisualExplanation({ concept, metrics }) {
  return (
    <div className="visual-explanation">
      <div className="visual-explanation-title">
        {concept.title}
      </div>

      <div className="visual-explanation-text">
        {concept.explanation(metrics)}
      </div>
    </div>
  );
}

export default VisualExplanation;
