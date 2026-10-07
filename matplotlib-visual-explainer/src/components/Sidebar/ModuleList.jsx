import { MATPLOTLIB_MODULES } from "../../data/modules";

function ModuleList() {
  return (
    <div className="module-list">
      {MATPLOTLIB_MODULES.map((module) => (
        <div className="module-item" key={module.title}>
          {module.title}
        </div>
      ))}
    </div>
  );
}

export default ModuleList;