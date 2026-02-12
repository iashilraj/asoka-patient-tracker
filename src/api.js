import axios from "axios";


export const API = axios.create({
baseURL: "https://asoka-backend-production.up.railway.app",
});


export const getPatients = () => API.get("/patients");
export const addPatient = (data) => API.post("/patients", data);
export const updatePatient = (id, data) => API.put(`/patients/${id}`, data);
export const deletePatient = (id) => API.delete(`/patients/${id}`);
