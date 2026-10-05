import ModuleNavigation from "./ModuleNavigation";

function Header({
  modules,
  activeModule,
  onModuleChange,
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-icon">BC</div>

        <div className="brand-text">
          <h1>BANARASI CODER</h1>
          <span>NumPy Explainer</span>
        </div>
      </div>

      <ModuleNavigation
        modules={modules}
        activeModule={activeModule}
        onModuleChange={onModuleChange}
      />
    </header>
  );
}

export default Header;
