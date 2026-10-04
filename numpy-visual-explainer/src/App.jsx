import { useState } from "react";
import "./index.css";

const modules = [
  {
    name: "Array Fundamentals",
    topics: 8,
  },
  {
    name: "Array Creation",
    topics: 12,
  },
  {
    name: "Data Types",
    topics: 10,
  },
  {
    name: "Indexing & Slicing",
    topics: 15,
  },
  {
    name: "NumPy Operations",
    topics: 12,
  },
  {
    name: "Mathematical Functions",
    topics: 13,
  },
  {
    name: "Aggregation & Statistics",
    topics: 16,
  },
  {
    name: "Reshaping & Dimensions",
    topics: 14,
  },
  {
    name: "Broadcasting",
    topics: 11,
  },
  {
    name: "Joining & Stacking",
    topics: 14,
  },
  {
    name: "Copy, View & Memory",
    topics: 10,
  },
  {
    name: "Searching & Sorting",
    topics: 13,
  },
  {
    name: "Linear Algebra",
    topics: 36,
  },
];

function App() {
  const [activeModule, setActiveModule] = useState(0);

  const currentModule = modules[activeModule];

  return (
    <div className="app">
      {/* =========================
          HEADER
      ========================= */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">N</div>

          <div className="brand-text">
            <h1>NUMPY VISUAL EXPLAINER</h1>

            <span>
              Banarasi Coder • Learn → See → Change → Experiment
            </span>
          </div>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          Guardian Protected
        </div>
      </header>

      {/* =========================
          MAIN LAYOUT
      ========================= */}
      <div className="layout">
        {/* =========================
            LEFT SIDEBAR
        ========================= */}
        <aside className="sidebar">
          <div className="sidebar-title">
            NUMPY CURRICULUM
          </div>

          <div className="module-list">
            {modules.map((module, index) => (
              <button
                key={module.name}
                className={`module ${
                  activeModule === index ? "active" : ""
                }`}
                onClick={() => setActiveModule(index)}
              >
                <div className="module-content">
                  <strong>{module.name}</strong>

                  <small>
                    {module.topics} Topics
                  </small>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* =========================
            MAIN CONTENT
        ========================= */}
        <main className="content">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span>
              Module {activeModule + 1}
            </span>

            <span>/</span>

            <strong>
              Topic 01
            </strong>
          </div>

          {/* Hero */}
          <section className="hero">
            <div className="hero-badge">
              MODULE {String(activeModule + 1).padStart(2, "0")}
              {" • "}
              {currentModule.name.toUpperCase()}
            </div>

            <h2>
              NumPy kya hai?
            </h2>

            <p>
              Python data ko efficiently represent aur process
              karne ke liye NumPy ka visual introduction.
            </p>
          </section>

          {/* =========================
              VISUALIZATION WORKSPACE
          ========================= */}
          <section className="workspace">
            <div className="workspace-header">
              <div>
                <span className="section-label">
                  VISUALIZATION
                </span>

                <h3>
                  Array Playground
                </h3>
              </div>

              <span className="live-badge">
                ● LIVE
              </span>
            </div>

            <div className="empty-visual">
              <div className="visual-icon">
                N
              </div>

              <h3>
                NumPy Visualization Engine
              </h3>

              <p>
                Array Engine yahan render hoga.
              </p>
            </div>
          </section>

          {/* =========================
              BOTTOM PANELS
          ========================= */}
          <div className="bottom-grid">
            {/* CODE */}
            <section className="panel">
              <div className="panel-title">
                <span>
                  NUMPY CODE
                </span>

                <small>
                  Python / NumPy
                </small>
              </div>

              <pre>
{`import numpy as np

arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])`}
              </pre>
            </section>

            {/* EXPLANATION */}
            <section className="panel">
              <div className="panel-title">
                <span>
                  EXPLANATION
                </span>

                <small>
                  Concept
                </small>
              </div>

              <p className="explanation">
                NumPy Python ki ek powerful numerical
                computing library hai jo multidimensional
                arrays aur mathematical operations ke liye
                optimized hai.
              </p>
            </section>
          </div>
        </main>

        {/* =========================
            RIGHT INSPECTOR
        ========================= */}
        <aside className="inspector">
          <div className="inspector-title">
            ARRAY INSPECTOR
          </div>

          <div className="metric">
            <span>SHAPE</span>
            <strong>—</strong>
          </div>

          <div className="metric">
            <span>NDIM</span>
            <strong>—</strong>
          </div>

          <div className="metric">
            <span>AXIS</span>
            <strong>—</strong>
          </div>

          <div className="metric">
            <span>SIZE</span>
            <strong>—</strong>
          </div>

          <div className="metric">
            <span>DTYPE</span>
            <strong>—</strong>
          </div>

          <div className="inspector-divider"></div>

          {/* Guardian */}
          <div className="protected">
            <span className="shield">
              🛡️
            </span>

            <div>
              <strong>
                Guardian Protected
              </strong>

              <small>
                Regression monitoring enabled
              </small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;