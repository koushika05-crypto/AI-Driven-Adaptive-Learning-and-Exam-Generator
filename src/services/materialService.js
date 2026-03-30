import axios from "axios";

const API_URL = "http://localhost:8080/upload";

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/pdf`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/video`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};