import React, { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8080/api";

function SubjectManager({ onSave }) {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [form, setForm] = useState({ name: "", courseId: "" });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: "", success: true });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${API}/courses`, { headers });
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setCourses([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubjects = useCallback(async (courseId) => {
    if (!courseId) { setSubjects([]); return; }
    try {
      const res = await fetch(`${API}/subjects/course/${courseId}`, { headers });
      const data = await res.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch {
      setSubjects([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const showMessage = (text, success = true) => {
    setMessage({ text, success });
    setTimeout(() => setMessage({ text: "", success: true }), 3000);
  };

  const handleCourseSelect = (e) => {
    const id = e.target.value;
    setSelectedCourse(id);
    setForm((f) => ({ ...f, courseId: id }));
    fetchSubjects(id);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showMessage("Subject name is required.", false);
      return;
    }
    if (!form.courseId) {
      showMessage("Please select a course.", false);
      return;
    }
    setLoading(true);
    try {
      const url = editId ? `${API}/subjects/${editId}` : `${API}/subjects`;
      const method = editId ? "PUT" : "POST";

      // Fix: backend expects course: { id } not courseId as flat field
      const payload = {
        name: form.name,
        course: { id: parseInt(form.courseId) },
      };

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showMessage(editId ? "Subject updated!" : "Subject added!");
        if (onSave) onSave();
        setForm({ name: "", courseId: selectedCourse });
        setEditId(null);
        fetchSubjects(selectedCourse);
      } else {
        showMessage("Something went wrong. Check the backend.", false);
      }
    } catch {
      showMessage("Network error. Is the backend running?", false);
    }
    setLoading(false);
  };

  const handleEdit = (subject) => {
    setForm({
      name: subject.name,
      courseId: subject.course?.id || subject.courseId || selectedCourse,
    });
    setEditId(subject.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      const res = await fetch(`${API}/subjects/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        showMessage("Subject deleted.");
        if (onSave) onSave();
        fetchSubjects(selectedCourse);
      } else {
        showMessage("Delete failed.", false);
      }
    } catch {
      showMessage("Network error.", false);
    }
  };

  const handleCancel = () => {
    setForm({ name: "", courseId: selectedCourse });
    setEditId(null);
  };

  const selectedCourseName =
    courses.find((c) => String(c.id) === String(selectedCourse))?.title || "—";

  return (
    <div>
      <h2 style={headingStyle}>{editId ? "Edit Subject" : "Add Subject"}</h2>

      {message.text && (
        <div style={{
          padding: "10px 16px", borderRadius: 6, marginBottom: 16,
          background: message.success ? "#dcfce7" : "#fee2e2",
          color: message.success ? "#166534" : "#991b1b",
          fontSize: 14,
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

          <div>
            <label style={labelStyle}>Subject name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Variables & Data Types"
            />
          </div>

          <div>
            <label style={labelStyle}>Course *</label>
            <select
              name="courseId"
              value={form.courseId}
              onChange={(e) => {
                handleChange(e);
                setSelectedCourse(e.target.value);
                fetchSubjects(e.target.value);
              }}
            >
              <option value="">Select course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Subject" : "Add Subject"}
          </button>
          {editId && (
            <button type="button" className="btn btn-warning" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "28px 0", borderColor: "#f1f5f9" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ ...headingStyle, marginBottom: 0 }}>Subjects</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Filter by course:</label>
          <select
            value={selectedCourse}
            onChange={handleCourseSelect}
            style={{ width: "auto", marginBottom: 0, padding: "6px 10px", fontSize: 13 }}
          >
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={statCard}>
          <div style={statLabel}>Total subjects</div>
          <div style={statValue}>{subjects.length}</div>
        </div>
        <div style={statCard}>
          <div style={statLabel}>Selected course</div>
          <div style={{ ...statValue, fontSize: 16 }}>{selectedCourseName}</div>
        </div>
      </div>

      {subjects.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: 14 }}>
          {selectedCourse
            ? "No subjects for this course yet."
            : "Select a course to view its subjects."}
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Subject name</th>
              <th style={{ width: "35%" }}>Course</th>
              <th style={{ width: "25%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td style={{ color: "#64748b", fontSize: 13 }}>
                  {s.course?.title || selectedCourseName}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-warning" onClick={() => handleEdit(s)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const headingStyle = { marginTop: 0, marginBottom: 20, fontSize: 20, color: "#1e293b" };
const labelStyle = { display: "block", fontSize: 12, fontWeight: 500, color: "#64748b", marginBottom: 5 };
const statCard = { background: "#f8fafc", borderRadius: 8, padding: "12px 20px", minWidth: 140 };
const statLabel = { fontSize: 12, color: "#64748b", marginBottom: 4 };
const statValue = { fontSize: 28, fontWeight: 700, color: "#3498db" };

export default SubjectManager;