import { useNavigate } from "react-router-dom";
import "./Home.css"; // create CSS if needed

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Vehicle Monitoring System</h1>
      <div className="button-grid">
        <button onClick={() => navigate("/insights")}>Data Insights</button>
        <button onClick={() => navigate("/register")}>Register Vehicle</button>
        <button onClick={() => navigate("/current")}>Current Vehicles</button>
        <button onClick={() => navigate("/logs")}>Vehicle Logs</button>
      </div>
    </div>
  );
}

export default Home;
