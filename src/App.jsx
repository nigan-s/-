import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import Home from "./features/home/Home";
import DataInsightsPage from "./features/dataInsights/DataInsightsPage";
import RegisterVehiclePage from "./features/registerVehicle/RegisterVehiclePage";
import CurrentVehiclesPage from "./features/currentVehicles/CurrentVehiclesPage";
import VehicleLogsPage from "./features/vehicleLogs/VehicleLogsPage";

function App() {
  const token = localStorage.getItem("access");
  return (
    <Router>
      <Routes>
      <Route path="/" element={token ? <Navigate to="/home" /> : <LoginPage />} />
      <Route path="/home" element={token ? <Home /> : <Navigate to="/" />} />
        <Route
          path="/insights"
          element={token ? <DataInsightsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={token ? <RegisterVehiclePage /> : <Navigate to="/" />}
        />
        <Route
          path="/current"
          element={token ? <CurrentVehiclesPage /> : <Navigate to="/" />}
        />
        <Route
          path="/logs"
          element={token ? <VehicleLogsPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
