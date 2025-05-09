import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/fetchWithAuth";


export default function RegisterVehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ registration_number: "", vehicle_type: "car" });
  const [error, setError] = useState("");

  const fetchVehicles = async () => {
    const token = localStorage.getItem("access");
    const res = await fetch("http://localhost:8000/api/vehicle/authorized-vehicles/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access");
      const res = await fetchWithAuth("http://localhost:8000/api/vehicle/authorized-vehicles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to register vehicle");
      setForm({ registration_number: "", vehicle_type: "car" });
      fetchVehicles();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 0 }}>
      <h2>Register Vehicle</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Registration Number"
          value={form.registration_number}
          onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
          required
        />
        <select
          value={form.vehicle_type}
          onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="truck">Truck</option>
          <option value="bus">Bus</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Add Vehicle</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <h3>Authorized Vehicles</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#007bff', color: '#fff' }}>
            <th>Registration</th>
            <th>Type</th>
            <th>Authorized</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.vehicle_id}>
              <td>{v.registration_number}</td>
              <td>{v.vehicle_type}</td>
              <td>{v.is_authorized ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}