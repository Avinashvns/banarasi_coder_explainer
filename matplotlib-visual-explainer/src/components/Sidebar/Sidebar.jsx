import ModuleList from "./ModuleList";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">MATPLOTLIB</div>
      <ModuleList />
    </aside>
  );
}

export default Sidebar;
