import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/fetchWithAuth";


export default function CurrentVehiclesPage() {
  const [current, setCurrent] = useState([]);

  useEffect(() => {
    const fetchCurrent = async () => {
      const token = localStorage.getItem("access");
      const res = await fetchWithAuth("http://localhost:8000/api/vehicle/current-vehicles/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCurrent(data);
    };
    fetchCurrent();
  }, []);

  return (
    <div style={{ padding: 0 }}>
      <h2>Currently Inside Vehicles</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#007bff', color: '#fff' }}>
            <th>Plate</th>
            <th>Type</th>
            <th>Entry Time</th>
          </tr>
        </thead>
        <tbody>
          {current.map(entry => (
            <tr key={entry.entry_id}>
              <td>{entry.plate_number_detected}</td>
              <td>{entry.vehicle?.vehicle_type || 'Unknown'}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
