import React, { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8080/api";

function MaterialManager({ onSave }) {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    type: "VIDEO",
    url: "",
    difficulty: "BEGINNER",
    subjectId: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await fetch(`${API}/materials`, { headers });
      const data = await res.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch {
      setMaterials([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await fetch(`${API}/subjects`, { headers });
      const data = await res.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch {
      setSubjects([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMaterials();
    fetchSubjects();
  }, [fetchMaterials, fetchSubjects]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.url || !form.subjectId) {
      showMessage("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const url = editId
        ? `${API}/materials/${editId}`
        : `${API}/materials`;
      const method = editId ? "PUT" : "POST";

      // Fix: backend expects subject: { id } not subjectId as flat field
      const payload = {
        title: form.title,
        type: form.type,
        url: form.url,
        difficulty: form.difficulty,
        subject: { id: parseInt(form.subjectId) },
      };

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showMessage(editId ? "Material updated!" : "Material added!");
        if (onSave) onSave();
        setForm({ title: "", type: "VIDEO", url: "", difficulty: "BEGINNER", subjectId: "" });
        setEditId(null);
        fetchMaterials();
      } else {
        showMessage("Something went wrong. Check the backend.");
      }
    } catch {
      showMessage("Network error. Is the backend running?");
    }
    setLoading(false);
  };

  const handleEdit = (mat) => {
    setForm({
      title: mat.title,
      type: mat.type,
      url: mat.url,
      difficulty: mat.difficulty,
      subjectId: mat.subject?.id || mat.subjectId || "",
    });
    setEditId(mat.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;
    try {
      const res = await fetch(`${API}/materials/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        showMessage("Material deleted.");
        if (onSave) onSave();
        fetchMaterials();
      }
    } catch {
      showMessage("Delete failed.");
    }
  };

  const handleCancel = () => {
    setForm({ title: "", type: "VIDEO", url: "", difficulty: "BEGINNER", subjectId: "" });
    setEditId(null);
  };

  const difficultyColor = (d) => {
    if (!d) return {};
    const map = {
      BEGINNER: { background: "#dcfce7", color: "#166534" },
      INTERMEDIATE: { background: "#fef9c3", color: "#854d0e" },
      ADVANCED: { background: "#fee2e2", color: "#991b1b" },
    };
    return map[d.toUpperCase()] || {};
  };

  const typeColor = (t) => {
    const map = {
      VIDEO: { background: "#ede9fe", color: "#5b21b6" },
      PDF: { background: "#fef3c7", color: "#92400e" },
      LINK: { background: "#e0f2fe", color: "#075985" },
    };
    return map[(t || "").toUpperCase()] || {};
  };

  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 20, color: "#1e293b" }}>
        {editId ? "Edit Material" : "Add Material"}
      </h2>

      {message && (
        <div style={{
          padding: "10px 16px", borderRadius: 6, marginBottom: 16,
          background: message.includes("!") ? "#dcfce7" : "#fee2e2",
          color: message.includes("!") ? "#166534" : "#991b1b",
          fontSize: 14,
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

          <div>
            <label style={labelStyle}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Intro to Variables"
            />
          </div>

          <div>
            <label style={labelStyle}>Subject *</label>
            <select name="subjectId" value={form.subjectId} onChange={handleChange}>
              <option value="">Select subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="VIDEO">Video</option>
              <option value="PDF">PDF</option>
              <option value="LINK">Link</option>
            </select>
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
            <label style={labelStyle}>URL / Link *</label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Material" : "Add Material"}
          </button>
          {editId && (
            <button type="button" className="btn btn-warning" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "28px 0", borderColor: "#f1f5f9" }} />

      <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20, color: "#1e293b" }}>
        All Materials
      </h2>

      {materials.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: 14 }}>No materials yet. Add one above.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Type</th>
              <th>Difficulty</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr key={mat.id}>
                <td>{mat.title}</td>
                <td>{mat.subject?.name || "—"}</td>
                <td>
                  <span style={{ ...badge, ...typeColor(mat.type) }}>
                    {mat.type}
                  </span>
                </td>
                <td>
                  <span style={{ ...badge, ...difficultyColor(mat.difficulty) }}>
                    {mat.difficulty}
                  </span>
                </td>
                <td>
                  <a href={mat.url} target="_blank" rel="noreferrer"
                    style={{ color: "#3498db", fontSize: 13 }}>
                    Open link
                  </a>
                </td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-warning" onClick={() => handleEdit(mat)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(mat.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

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

export default MaterialManager;