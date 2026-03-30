import axios from "axios";

const API = "http://localhost:8080/api/topics";

export const getTopics = () => axios.get(API);

export const uploadTopic = (data) =>
axios.post(API + "/upload", data);

export const deleteTopic = (id) =>
axios.delete(API + "/" + id);