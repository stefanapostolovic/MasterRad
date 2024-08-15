import React, { useEffect, useState } from "react";
import { Popover, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"
import logo from "../../resources/images/logo.png"
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { getAllCourseNames } from "../../services/CourseService";

function Sidebar() {
  const navigate = useNavigate();
  const [courseNames, setCourseNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); 

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const goToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchCourseNames = async () => {
      try {
        const data = await getAllCourseNames();
        setCourseNames(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch course names");
        setLoading(false);
      }
    };

    fetchCourseNames();
  }, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="sidebar">
      <button className="iconButton" onClick={goToHome}>
        <img src={logo} alt="logo" className="sidebar-logo" />
      </button>
      <button className="iconTextButton" onClick={handleClick}>
        <CollectionsBookmarkIcon />
        <p className="paragraph">Courses</p>
      </button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#192637", // Background color of the modal
            color: "white", // Text color inside the modal
          },
        }}
      >
        <List>
          {courseNames.map((courseName, index) => (
            <ListItem
              button
              key={index}
              onClick={() => navigate(`/course/${courseName}`)}
            >
              <ListItemText primary={courseName} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
}

export default Sidebar;