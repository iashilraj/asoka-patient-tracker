import axios from "axios";

export const API = axios.create({
  baseURL: "https://asoka-backend-production.up.railway.app",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export const getPatients = () => API.get("/patients");
export const addPatient = (data) => API.post("/patients", data);
export const updatePatient = (id, data) => API.put(`/patients/${id}`, data);
export const deletePatient = (id) => API.delete(`/patients/${id}`);

export const addVisit = (patientId, data) =>
  API.post(`/patients/${patientId}/visits`, data);
export const updateVisit = (patientId, visitId, data) =>
  API.put(`/patients/${patientId}/visits/${visitId}`, data);
export const deleteVisit = (patientId, visitId) =>
  API.delete(`/patients/${patientId}/visits/${visitId}`);

export const uploadLabReport = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/upload/lab", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadDoctorSignature = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/upload/signature", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadCaseSheet = (patientId) =>
  API.get(`/patients/${patientId}/print`, {
    responseType: "blob",
  });
