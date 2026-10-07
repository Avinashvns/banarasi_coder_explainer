import { useState } from "react";

import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import Home from "../pages/Home/Home";

import "./MainLayout.css";

function MainLayout() {
  const [selectedModule, setSelectedModule] =
    useState("Introduction");

  return (
    <>
      <Header />

      <div className="layout">
        <Sidebar
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
        />

        <main className="main-content">
          <Home
            selectedModule={selectedModule}
          />
        </main>
      </div>
    </>
  );
}

export default MainLayout;