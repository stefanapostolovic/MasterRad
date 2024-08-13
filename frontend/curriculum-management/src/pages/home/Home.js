import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import CardGrid from "../../components/card_grid/CardGrid";
import "./Home.css"

function Home() {
  return (
    <div>
      <div className="title">
        <h1>Available Courses</h1>
      </div>
      <CardGrid />
    </div>
  );
}

export default Home;