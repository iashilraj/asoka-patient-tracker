import React, { useEffect, useState } from "react";
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
  downloadCaseSheet,
} from "./api";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import Login from "./components/Login";
import VisitManager from "./components/VisitManager";
import "./App.css";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [visitPatient, setVisitPatient] = useState(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [viewedPatient, setViewedPatient] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activePatientId, setActivePatientId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const loadPatients = async () => {
    const res = await getPatients();
    setPatients(res.data);
  };

  useEffect(() => {
    if (isLoggedIn) loadPatients();
  }, [isLoggedIn]);

  const handleSubmit = async (data) => {
    if (selected) await updatePatient(selected._id, data);
    else await addPatient(data);

    setSelected(null);
    setIsFormModalOpen(false);
    loadPatients();
  };

  const handleDelete = async (id) => {
    await deletePatient(id);
    if (selected?._id === id) setSelected(null);
    if (visitPatient?._id === id) setVisitPatient(null);
    if (activePatientId === id) setActivePatientId(null);
    loadPatients();
  };

  const handleEditPatient = (patient) => {
    setSelected(patient);
    setActivePatientId(patient._id);
    setIsFormModalOpen(true);
  };

  const handleViewPatient = (patient) => {
    setViewedPatient(patient);
    setActivePatientId(patient._id);
  };

  const handleManageVisits = (patient) => {
    setVisitPatient(patient);
    setActivePatientId(patient._id);
    setIsVisitModalOpen(true);
  };

  const closeVisitModal = () => {
    setIsVisitModalOpen(false);
  };

  const openAddPatientModal = () => {
    setSelected(null);
    setIsFormModalOpen(true);
  };

  const closePatientModal = () => {
    setIsFormModalOpen(false);
    setSelected(null);
  };

  const handlePatientUpdated = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((p) => (p._id === updatedPatient._id ? updatedPatient : p))
    );

    if (selected?._id === updatedPatient._id) {
      setSelected(updatedPatient);
    }

    if (visitPatient?._id === updatedPatient._id) {
      setVisitPatient(updatedPatient);
    }
  };

  const handlePrintCaseSheet = async (patient) => {
    try {
      const res = await downloadCaseSheet(patient._id);
      const fileBlob = new Blob([res.data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(fileBlob);
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(fileUrl), 30000);
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to generate case sheet.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="page login-page">
        <Login onLogin={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="app-header sticky-topbar">
          <div>
            <p className="eyebrow">Patient Management</p>
            <h1>Asoka Homoeo Clinic</h1>
          </div>

          <div className="topbar-actions">
            <button className="btn btn-primary" onClick={openAddPatientModal}>
              Add Patient
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {isFormModalOpen && (
          <div className="modal-overlay" onClick={closePatientModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <PatientForm
                onSubmit={handleSubmit}
                selected={selected}
                clearSelection={() => setSelected(null)}
                onClose={closePatientModal}
              />
            </div>
          </div>
        )}

        <PatientList
          patients={patients}
          onView={handleViewPatient}
          onEdit={handleEditPatient}
          onDelete={handleDelete}
          onManageVisits={handleManageVisits}
          onPrintCaseSheet={handlePrintCaseSheet}
          activePatientId={activePatientId}
          onSelectPatient={(patient) => setActivePatientId(patient._id)}
        />

        {viewedPatient && (
          <div className="card">
            <h2>Patient View</h2>
            <div className="form-grid">
              <p><strong>Name:</strong> {viewedPatient.name || "-"}</p>
              <p><strong>Mobile:</strong> {viewedPatient.mobile || "-"}</p>
              <p><strong>Ref ID:</strong> {viewedPatient.refId || "-"}</p>
              <p><strong>Age / Sex:</strong> {viewedPatient.age || "-"} / {viewedPatient.sex || "-"}</p>
            </div>
          </div>
        )}

        {isVisitModalOpen && visitPatient && (
          <div className="modal-overlay" onClick={closeVisitModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <VisitManager
                patient={visitPatient}
                onPatientUpdated={handlePatientUpdated}
                onClose={closeVisitModal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
