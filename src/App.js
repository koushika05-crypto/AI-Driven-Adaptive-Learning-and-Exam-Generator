import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorDashboard from "./pages/InstructorDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import Navbar from "./components/Navbar";

const hideNavbarRoutes = ["/instructor-dashboard", "/student-dashboard", "/admin-dashboard"];

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRole && role.toUpperCase() !== allowedRole.toUpperCase())
    return <Navigate to="/login" replace />;
  return children;
}

function Layout() {
  const location = useLocation();
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/"        element={<Login />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/instructor-dashboard" element={
          <ProtectedRoute allowedRole="INSTRUCTOR">
            <InstructorDashboard />
          </ProtectedRoute>
        }/>

        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }/>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;