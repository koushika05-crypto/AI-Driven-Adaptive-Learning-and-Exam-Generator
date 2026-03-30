import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// ── Axios instance with JWT auto-attached ──────────────
const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ───────────────────────────────────────────────
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerUser = (email, password, role) =>
  api.post("/auth/register", { email, password, role });

// ── Courses ────────────────────────────────────────────
export const getAllCourses = () =>
  api.get("/courses");

export const getCourse = (id) =>
  api.get(`/courses/${id}`);

export const createCourse = (data) =>
  api.post("/courses", data);

export const updateCourse = (id, data) =>
  api.put(`/courses/${id}`, data);

export const deleteCourse = (id) =>
  api.delete(`/courses/${id}`);

// ── Subjects ───────────────────────────────────────────
export const getAllSubjects = () =>
  api.get("/subjects");

export const getSubjectsByCourse = (courseId) =>
  api.get(`/subjects/course/${courseId}`);

export const createSubject = (data) =>
  api.post("/subjects", data);

export const updateSubject = (id, data) =>
  api.put(`/subjects/${id}`, data);

export const deleteSubject = (id) =>
  api.delete(`/subjects/${id}`);

// ── Materials ──────────────────────────────────────────
export const getAllMaterials = () =>
  api.get("/materials");

export const getMaterialsBySubject = (subjectId) =>
  api.get(`/materials/subject/${subjectId}`);

export const createMaterial = (data) =>
  api.post("/materials", data);

export const updateMaterial = (id, data) =>
  api.put(`/materials/${id}`, data);

export const deleteMaterial = (id) =>
  api.delete(`/materials/${id}`);

export default api;