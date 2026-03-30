import React, { useState, useEffect, useCallback } from "react";
import { FaGraduationCap, FaStar, FaChartLine, FaUser, FaSignOutAlt } from "react-icons/fa";
import AdaptiveQuiz from "../components/AdaptiveQuiz";
import ProgressTracker from "../components/ProgressTracker";
import SuggestedLessons from "../components/SuggestedLessons";
import "../styles/student.css";

function StudentDashboard() {
  const [page, setPage]     = useState("learning");
  const [stats, setStats]   = useState({ score: 0, lessons: 0, streak: 0, level: "Beginner" });
  const [progress, setProgress] = useState([]);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch("http://localhost:8080/api/student/stats", { headers });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch { }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProgress = useCallback(async () => {
    try {
      const res  = await fetch("http://localhost:8080/api/student/progress", { headers });
      const data = await res.json();
      if (res.ok) setProgress(Array.isArray(data) ? data : []);
    } catch { }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchStats();
    fetchProgress();
  }, [fetchStats, fetchProgress]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const levelColor = { Beginner: "#16a34a", Intermediate: "#d97706", Advanced: "#dc2626" };

  return (
    <div className="s-dashboard">

      <div className="s-sidebar">
        <h2 className="s-logo">SkillForge</h2>
        <p className="s-role">Student</p>

        <button className={page === "learning" ? "active" : ""} onClick={() => setPage("learning")}>
          <FaGraduationCap className="icon" /> My Learning
        </button>
        <button className={page === "quiz" ? "active" : ""} onClick={() => setPage("quiz")}>
          <FaStar className="icon" /> Adaptive Quiz
        </button>
        <button className={page === "progress" ? "active" : ""} onClick={() => setPage("progress")}>
          <FaChartLine className="icon" /> Progress
        </button>
        <button className={page === "profile" ? "active" : ""} onClick={() => setPage("profile")}>
          <FaUser className="icon" /> Profile
        </button>
        <button className="s-logout" onClick={logout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>
      </div>

      <div className="s-content">

        <div className="s-topbar">
          <div>
            <p className="s-breadcrumb">Student dashboard</p>
            <h1>{page === "learning" ? "My Learning" : page === "quiz" ? "Adaptive Quiz" : page === "progress" ? "Progress" : "Profile"}</h1>
          </div>
          <div className="s-avatar">DK</div>
        </div>

        <div className="s-stats">
          <div className="s-stat">
            <div className="s-stat-label">Overall score</div>
            <div className="s-stat-val">{stats.score}%</div>
            <div className="s-stat-sub s-green">Adaptive</div>
          </div>
          <div className="s-stat">
            <div className="s-stat-label">Lessons done</div>
            <div className="s-stat-val">{stats.lessons}</div>
            <div className="s-stat-sub" style={{color:"#94a3b8"}}>completed</div>
          </div>
          <div className="s-stat">
            <div className="s-stat-label">Quiz streak</div>
            <div className="s-stat-val">{stats.streak}</div>
            <div className="s-stat-sub s-amber">days in a row</div>
          </div>
          <div className="s-stat">
            <div className="s-stat-label">Current level</div>
            <div className="s-stat-val" style={{fontSize:20,color:levelColor[stats.level]||"#2563eb"}}>{stats.level}</div>
            <div className="s-stat-sub" style={{color:"#2563eb"}}>Adaptive</div>
          </div>
        </div>

        {page === "learning"  && <SuggestedLessons progress={progress} onQuiz={() => setPage("quiz")} />}
        {page === "quiz"      && <AdaptiveQuiz stats={stats} onComplete={fetchStats} />}
        {page === "progress"  && <ProgressTracker progress={progress} />}

      </div>
    </div>
  );
}

export default StudentDashboard;