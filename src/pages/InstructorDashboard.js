import React, { useState, useEffect, useCallback } from "react";
import { FaBook, FaLayerGroup, FaVideo, FaSignOutAlt, FaStar } from "react-icons/fa";
import CourseManager from "../components/CourseManager";
import SubjectManager from "../components/SubjectManager";
import MaterialManager from "../components/MaterialManager";
import AIQuizGenerator from "../components/AIQuizGenerator";
import "../styles/instructor.css";

function InstructorDashboard() {
  const [page, setPage] = useState("course");
  const [stats, setStats] = useState({ courses: 0, subjects: 0, videos: 0 });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStats = useCallback(async () => {
    try {
      const [cRes, sRes, mRes] = await Promise.all([
        fetch("http://localhost:8080/api/courses",   { headers }),
        fetch("http://localhost:8080/api/subjects",  { headers }),
        fetch("http://localhost:8080/api/materials", { headers }),
      ]);
      const courses   = cRes.ok ? await cRes.json() : [];
      const subjects  = sRes.ok ? await sRes.json() : [];
      const materials = mRes.ok ? await mRes.json() : [];
      setStats({
        courses:  Array.isArray(courses)   ? courses.length  : 0,
        subjects: Array.isArray(subjects)  ? subjects.length : 0,
        videos:   Array.isArray(materials)
          ? materials.filter((m) => (m.type || "").toUpperCase() === "VIDEO").length
          : 0,
      });
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const navItems = [
    { key: "course",   label: "Course Manager",   icon: <FaBook className="icon" /> },
    { key: "subject",  label: "Subject Manager",  icon: <FaLayerGroup className="icon" /> },
    { key: "material", label: "Material Manager", icon: <FaVideo className="icon" /> },
    { key: "quiz",     label: "AI Quiz Generator", icon: <FaStar className="icon" /> },
  ];

  const pageTitle = {
    course:   "Course Manager",
    subject:  "Subject Manager",
    material: "Material Manager",
    quiz:     "AI Quiz Generator",
  };

  return (
    <div className="dashboard">

      {/* ── SIDEBAR ── */}
      <div className="sidebar">
        <h2 className="logo">SkillForge</h2>
        <p className="role">Instructor</p>

        {navItems.map((item) => (
          <button
            key={item.key}
            className={page === item.key ? "active" : ""}
            onClick={() => setPage(item.key)}
          >
            {item.icon} {item.label}
          </button>
        ))}

        <button className="logout" onClick={logout}>
          <FaSignOutAlt className="icon" /> Logout
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="content">

        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: 28,
        }}>
          <div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 2 }}>
              Instructor Dashboard
            </p>
            <h1 style={{ margin: 0 }}>{pageTitle[page]}</h1>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "#1d4ed8", color: "white",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 700, fontSize: 15,
          }}>
            IN
          </div>
        </div>

        {/* Stat cards */}
        <div className="cards">
          <div className="card">
            <h3>Total Courses</h3>
            <p>{stats.courses}</p>
          </div>
          <div className="card">
            <h3>Total Subjects</h3>
            <p>{stats.subjects}</p>
          </div>
          <div className="card">
            <h3>Total Videos</h3>
            <p>{stats.videos}</p>
          </div>
        </div>

        {/* Manager panel */}
        <div className="manager-section">
          {page === "course"   && <CourseManager   onSave={fetchStats} />}
          {page === "subject"  && <SubjectManager  onSave={fetchStats} />}
          {page === "material" && <MaterialManager onSave={fetchStats} />}
          {page === "quiz"     && <AIQuizGenerator />}
        </div>

      </div>
    </div>
  );
}

export default InstructorDashboard;