import { useEffect, useState } from "react";
import axios from "axios";
import "./Stats.css";
import { API_URL } from "../../config/api";

function StatCard({ num, tag, bgcolor }) {
  return (
    <div className="stat-card" style={{ background: bgcolor }}>
      <div className="num-stat">{num}</div>
      <div className="stat-tag">{tag}</div>
    </div>
  );
}

function Stats() {
  const [stats, setStats] = useState({ students: 0, alumni: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`);
        const users = res.data || [];
        const students = users.filter((u) => u.role === "student").length;
        const alumni = users.filter((u) => u.role === "alumni").length;
        setStats({ students, alumni });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="outer-container">
      <StatCard
        num={`${stats.students}+`}
        tag="Active Students"
        bgcolor="var(--stat-card-students)"
      />
      <StatCard
        num={`${stats.alumni}+`}
        tag="Alumni"
        bgcolor="var(--stat-card-alumni)"
      />
      <StatCard num="0+" tag="Teams Formed" bgcolor="var(--stat-card-teams)" />
    </div>
  );
}

export default Stats;
