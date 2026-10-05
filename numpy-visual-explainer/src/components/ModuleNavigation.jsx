function ModuleNavigation({
  modules,
  activeModule,
  onModuleChange,
}) {
  return (
    <nav className="module-nav">
      {modules.map((module, index) => (
        <button
          key={module.name}
          className={`module-nav-item ${
            activeModule === index ? "active" : ""
          }`}
          onClick={() => onModuleChange(index)}
        >
          {module.name}
        </button>
      ))}
    </nav>
  );
}

export default ModuleNavigation;
