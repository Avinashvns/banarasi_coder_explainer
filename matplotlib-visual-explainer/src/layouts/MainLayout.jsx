import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import Home from "../pages/Home/Home";
import "./MainLayout.css";

function MainLayout() {
  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Home />
        </main>
      </div>
    </>
  );
}

export default MainLayout;
