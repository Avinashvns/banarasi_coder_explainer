import { INTRODUCTION_CONTROLS } from "../introduction/introductionData";

function IntroductionControls({
  selectedTopic,
  setSelectedTopic,
}) {
  return (
    <div className="introduction-controls">

      {INTRODUCTION_CONTROLS.map((section) => (
        <section
          className="intro-control-box"
          key={section.title}
        >
          <div className="intro-control-title">
            {section.title}
          </div>

          <div className="intro-control-options">
            {section.items.map((item) => (
              <button
                key={item.key}
                className={
                  selectedTopic === item.key
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setSelectedTopic(item.key)
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>
      ))}

    </div>
  );
}

export default IntroductionControls;