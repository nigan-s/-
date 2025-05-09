import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/fetchWithAuth";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DataInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await fetchWithAuth("http://localhost:8000/api/insights/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load insights");
        const data = await res.json();
        setInsights(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchInsights();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!insights) return <div>Loading insights...</div>;

  const { daily_stats = [], vehicle_type_distribution = {}, unauthorized_attempts = [], top_vehicles_by_time = [] } = insights;

  const vehicleTypeData = Object.entries(vehicle_type_distribution).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  return (
    <div style={{ padding: 0 }}>
      <h2>Data Insights</h2>

      {/* Daily Entries and Exits */}
      <h3>Daily Vehicle Entries & Exits</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={daily_stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="entries" stroke="#8884d8" />
          <Line type="monotone" dataKey="exits" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      {/* Vehicle Type Distribution */}
      <h3>Vehicle Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={vehicleTypeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {vehicleTypeData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Top Vehicles by Time */}
      <h3>Top Vehicles by Time Spent</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={top_vehicles_by_time}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="registration_number" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_time_minutes" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
