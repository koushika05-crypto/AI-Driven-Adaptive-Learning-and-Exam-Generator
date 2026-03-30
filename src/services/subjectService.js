import axios from "axios";

const API="http://localhost:8080/api/subjects";

export const getSubjects=()=>axios.get(API);

export const addSubject=(subject)=>axios.post(API,subject);

export const deleteSubject=(id)=>axios.delete(`${API}/${id}`);