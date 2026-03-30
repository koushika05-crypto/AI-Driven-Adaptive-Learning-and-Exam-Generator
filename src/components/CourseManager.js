import React, { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8080/api";

function CourseManager({ onSave }) {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "BEGINNER",
  });
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

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const showMessage = (text, success = true) => {
    setMessage({ text, success });
    setTimeout(() => setMessage({ text: "", success: true }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showMessage("Course title is required.", false);
      return;
    }
    setLoading(true);
    try {
      const url = editId ? `${API}/courses/${editId}` : `${API}/courses`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showMessage(editId ? "Course updated!" : "Course created!");
        if (onSave) onSave();
        setForm({ title: "", description: "", difficulty: "BEGINNER" });
        setEditId(null);
        fetchCourses();
      } else {
        showMessage("Something went wrong. Check the backend.", false);
      }
    } catch {
      showMessage("Network error. Is the backend running?", false);
    }
    setLoading(false);
  };

  const handleEdit = (course) => {
    setForm({
      title: course.title,
      description: course.description || "",
      difficulty: course.difficulty || "BEGINNER",
    });
    setEditId(course.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      const res = await fetch(`${API}/courses/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        showMessage("Course deleted.");
        if (onSave) onSave();
        fetchCourses();
      } else {
        showMessage("Delete failed.", false);
      }
    } catch {
      showMessage("Network error.", false);
    }
  };

  const handleCancel = () => {
    setForm({ title: "", description: "", difficulty: "BEGINNER" });
    setEditId(null);
  };

  const difficultyBadge = (d = "") => {
    const map = {
      BEGINNER:     { background: "#dcfce7", color: "#166534" },
      INTERMEDIATE: { background: "#fef9c3", color: "#854d0e" },
      ADVANCED:     { background: "#fee2e2", color: "#991b1b" },
    };
    return map[d.toUpperCase()] || {};
  };

  return (
    <div>
      <h2 style={headingStyle}>
        {editId ? "Edit Course" : "Add Course"}
      </h2>

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
            <label style={labelStyle}>Course title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to Python"
            />
          </div>

          <div>
            <label style={labelStyle}>Difficulty</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief overview of this course..."
            />
          </div>

        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Course" : "Add Course"}
          </button>
          {editId && (
            <button type="button" className="btn btn-warning" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "28px 0", borderColor: "#f1f5f9" }} />

      <h2 style={headingStyle}>All Courses</h2>

      {courses.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: 14 }}>
          No courses yet. Add one above.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Title</th>
              <th style={{ width: "40%" }}>Description</th>
              <th style={{ width: "15%" }}>Difficulty</th>
              <th style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td style={{ fontWeight: 500 }}>{course.title}</td>
                <td style={{ color: "#64748b", fontSize: 13 }}>
                  {course.description
                    ? course.description.length > 80
                      ? course.description.slice(0, 80) + "..."
                      : course.description
                    : "—"}
                </td>
                <td>
                  <span style={{ ...badge, ...difficultyBadge(course.difficulty) }}>
                    {course.difficulty || "—"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(course.id)}
                    >
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

const headingStyle = {
  marginTop: 0,
  marginBottom: 20,
  fontSize: 20,
  color: "#1e293b",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 5,
};

const badge = {
  display: "inline-block",
  padding: "3px 9px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 500,
};

export default CourseManager;