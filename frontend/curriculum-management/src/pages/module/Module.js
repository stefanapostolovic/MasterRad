import { useLocation, useNavigate } from "react-router-dom";
import "./Module.css"
import { useEffect, useState } from "react";
import { getModuleByName } from "../../services/ModuleService";
import Button from "@mui/material/Button";
import AlarmIcon from "@mui/icons-material/Alarm";

function Module() {
  const navigate = useNavigate()
  const location = useLocation();
  const { title, description } = location.state || {};

  const [module, setModule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const data = await getModuleByName(title);
        setModule(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch module info for module: ", title);
        setLoading(false);
      }
    };

    fetchModule();
  }, []);

  // Helper function to extract YouTube video ID from URL
  const getYouTubeID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const type = 'module'
  const takeTheTest = () => {
    navigate(`/${title}/test`, { state: { type } });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="module-detail">
      <h1>{title}</h1>
      <p>{description}</p>
      <div>{module.text}</div>
      <div className="image-row">
        {module.images.map((image, index) => (
          <div>
            <div>
              <img
                key={index}
                src={image.url}
                alt={`Image ${index + 1}`}
                className="image"
              />
            </div>
            <div className="subext">
              <p>Image {index + 1}: {image.description}</p>
            </div>
          </div>
        ))}
      </div>
      <h2>Video materials:</h2>
      <div className="video-row">
        {module.videos.map((video, index) => {
          const videoId = getYouTubeID(video.url);
          if (!videoId) {
            console.error(`Invalid YouTube URL: ${video.url}`);
            return null;
          }
          return (
            <div>
              <div>
                <iframe
                  key={index}
                  width="500"
                  height="300"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`YouTube video ${index + 1}`}
                  className="video"
                ></iframe>
              </div>
              <div className="subext">
                <p>Video {index + 1}: {video.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Button variant="contained" startIcon={<AlarmIcon/>} className="bottom-button" onClick={takeTheTest}>
        Take the test
      </Button>
    </div>
  );
}

export default Module