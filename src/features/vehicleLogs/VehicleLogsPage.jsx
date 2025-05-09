import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/fetchWithAuth";


export default function VehicleLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("access");
      const res = await fetchWithAuth("http://13.201.224.44:8000/api/vehicle/vehicle-logs/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        console.error("Failed to fetch logs");
        return;
      }
      const data = await res.json();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Vehicle Entry & Exit Logs</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#007bff', color: '#fff' }}>
            <th>Plate</th>
            <th>Type</th>
            <th>Status</th>
            <th>Time</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.entry_id}>
              <td>{log.plate_number_detected}</td>
              <td>{log.vehicle?.vehicle_type || 'Unknown'}</td>
              <td>{log.is_entry ? 'IN' : 'OUT'}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>
                {log.duration_inside 
                  ? `${Math.floor((new Date(log.duration_inside) - new Date(0)) / 60000)} min`
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}