import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"
import logo from "../../resources/images/logo.png"
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";

function Sidebar() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="sidebar">
      <button className="iconButton" onClick={goToHome}>
        <img src={logo} alt="logo" className="sidebar-logo" />
      </button>
      <button className="iconTextButton">
        <CollectionsBookmarkIcon />
        <p className="paragraph">Kursevi</p>
      </button>
    </div>
  );
}

export default Sidebar;