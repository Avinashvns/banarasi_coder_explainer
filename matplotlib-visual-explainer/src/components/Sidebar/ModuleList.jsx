import { MATPLOTLIB_MODULES } from "../../data/modules";

function ModuleList({
  selectedModule,
  setSelectedModule,
}) {
  return (
    <div className="module-list">
      {MATPLOTLIB_MODULES.map((module) => (
        <div
          key={module.title}
          className={`module-item ${
            selectedModule === module.title ? "active" : ""
          }`}
          onClick={() => setSelectedModule(module.title)}
        >
          {module.title}
        </div>
      ))}
    </div>
  );
}

export default ModuleList;