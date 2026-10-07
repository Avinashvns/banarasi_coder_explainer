import ModuleList from "./ModuleList";
import "./Sidebar.css";

function Sidebar({ selectedModule, setSelectedModule }) {
  return (
    <aside className="sidebar">

      <ModuleList
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
      />
    </aside>
  );
}

export default Sidebar;