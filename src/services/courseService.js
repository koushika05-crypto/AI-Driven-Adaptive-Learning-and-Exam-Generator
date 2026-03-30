import API from "./api";

export const getCourses = () => API.get("/courses");

export const addCourse = (course) => API.post("/courses", course);

export const deleteCourse = (id) => API.delete(`/courses/${id}`);