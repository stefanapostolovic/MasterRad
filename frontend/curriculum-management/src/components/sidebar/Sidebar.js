import React, { useEffect, useState } from "react";
import { Popover, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css"
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { checkIfCanAccessCourse, getAllCourseNames } from "../../services/CourseService";
import Divider from "@mui/material/Divider";
import BookIcon from "@mui/icons-material/Book";
import MenuBookIcon from "@mui/icons-material/MenuBook";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clickedCourseName, setClickedCourseName] = useState("");
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

  const description = ""

  const goToModules = () => {
    navigate(`/course/${clickedCourseName}`, {
      state: { clickedCourseName, description },
    });
  }

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    if (location.pathname === "/") {
      setClickedCourseName(""); // Hide course name on the home page
    } else if (pathSegments.includes("course")) {
      setClickedCourseName(decodeURIComponent(pathSegments[2])); // Set course name from the URL
    }
  }, [location.pathname]);

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
        {/* <img src={logo} alt="logo" className="sidebar-logo" /> */}
        <MenuBookIcon sx={{ fontSize: 51, marginBottom: "51%" }} />
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
      {clickedCourseName && (
        <Divider
          sx={{
            borderColor: "white",
            borderBottomWidth: 1,
            width: "150%",
            marginY: 1 /* Vertical margin */,
          }}
        />
      )}
      {clickedCourseName && (
        <div className="course-name">{clickedCourseName}</div>
      )}
      {clickedCourseName && (
        <button className="iconTextButton" onClick={goToModules}>
          <BookIcon sx={{ color: "#f5cb43" }} />
          <p className="icon-paragraph">All lessons</p>
        </button>
      )}
    </div>
  );
}

export default Sidebar;