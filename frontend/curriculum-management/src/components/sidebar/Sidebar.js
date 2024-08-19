import React, { useEffect, useState } from "react";
import { Popover, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css"
import logo from "../../resources/images/logo.png"
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { checkIfCanAccessCourse, getAllCourseNames } from "../../services/CourseService";

function Sidebar() {
  const navigate = useNavigate();
  const [courseNames, setCourseNames] = useState({});
  const [accessList, setAccessList] = useState({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); 

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCourseClick = (courseName) => {
    handleClose();
    navigate(`/course/${courseName}`)
  }

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

  useEffect(() => {
    if (courseNames.length > 0) {
      const checkAccess = async () => {
        try {
          const accessibilities = {};

          for (const name of courseNames) {
            const result = await checkIfCanAccessCourse(name);
            accessibilities[name] = result[name] === true;
          }

          setAccessList(accessibilities);
        } catch (err) {
          setError("Failed to check course accessibility");
        }
      };

      checkAccess();
    }
  }, [courseNames]);

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
              disabled={!accessList[courseName]} // Disable if access is false
              key={index}
              onClick={() => handleCourseClick(courseName)}
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