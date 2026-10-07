import { INTRODUCTION_SECTIONS } from "./introductionData";

function IntroductionContent({ selectedTopic }) {
  const content =
    INTRODUCTION_SECTIONS[selectedTopic];

  if (!content) {
    return null;
  }

  return (
    <section className="introduction-content">

      <div className="introduction-content-header">
        <span className="introduction-badge">
          INTRODUCTION
        </span>

        <h2>{content.title}</h2>
      </div>

      <p className="introduction-description">
        {content.description}
      </p>

      <div className="introduction-points">
        {content.points.map((point, index) => (
          <div
            className="introduction-point"
            key={point}
          >
            <span className="point-number">
              {index + 1}
            </span>

            <span>{point}</span>
          </div>
        ))}
      </div>

    </section>
  );
}

export default IntroductionContent;