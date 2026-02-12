import React, { useMemo, useState } from "react";
import {
  addVisit,
  updateVisit,
  deleteVisit,
  uploadLabReport,
  uploadDoctorSignature,
} from "../api";

const emptyVisit = {
  date: "",
  vitals: {
    height: "",
    weight: "",
    pulse: "",
    bp: "",
    temp: "",
    spo2: "",
  },
  symptoms: "",
  prescription: "",
  fee: "",
  labReportUrl: "",
  doctorSignUrl: "",
};

function normalizeVisitForUI(visit = {}) {
  return {
    ...emptyVisit,
    ...visit,
    vitals: {
      ...emptyVisit.vitals,
      ...visit.vitals,
      height: visit?.vitals?.height ?? visit?.height ?? "",
      weight: visit?.vitals?.weight ?? visit?.weight ?? "",
      pulse: visit?.vitals?.pulse ?? visit?.pulse ?? "",
      bp: visit?.vitals?.bp ?? visit?.bp ?? "",
      temp: visit?.vitals?.temp ?? visit?.temp ?? "",
      spo2: visit?.vitals?.spo2 ?? visit?.spo2 ?? "",
    },
  };
}

export default function VisitManager({ patient, onPatientUpdated, onClose }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingVisitId, setEditingVisitId] = useState(null);
  const [form, setForm] = useState(emptyVisit);
  const [uploadingLab, setUploadingLab] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const visits = useMemo(() => {
    if (!patient) return [];
    if (Array.isArray(patient.visits)) return patient.visits.map(normalizeVisitForUI);
    if (patient.firstVisit) return [normalizeVisitForUI(patient.firstVisit)];
    return [];
  }, [patient]);

  const resetFormState = () => {
    setForm(emptyVisit);
    setEditingVisitId(null);
    setIsAdding(false);
    setUploadingLab(false);
    setUploadingSignature(false);
    setUploadError("");
  };

  const handleFieldChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVitalChange = (e) => {
    setForm((prev) => ({
      ...prev,
      vitals: { ...prev.vitals, [e.target.name]: e.target.value },
    }));
  };

  const handleAddNewClick = () => {
    setIsAdding(true);
    setEditingVisitId(null);
    setForm(emptyVisit);
  };

  const handleEditClick = (visit) => {
    setIsAdding(false);
    setEditingVisitId(visit._id);
    setForm(normalizeVisitForUI(visit));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!patient) return;

    let res;
    if (editingVisitId) {
      res = await updateVisit(patient._id, editingVisitId, form);
    } else {
      res = await addVisit(patient._id, form);
    }

    onPatientUpdated(res.data);
    resetFormState();
  };

  const handleLabUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadingLab(true);
    try {
      const res = await uploadLabReport(file);
      setForm((prev) => ({ ...prev, labReportUrl: res.data.url || "" }));
    } catch (error) {
      setUploadError(error?.response?.data?.message || "Lab report upload failed");
    } finally {
      setUploadingLab(false);
      e.target.value = "";
    }
  };

  const handleSignatureUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadingSignature(true);
    try {
      const res = await uploadDoctorSignature(file);
      setForm((prev) => ({ ...prev, doctorSignUrl: res.data.url || "" }));
    } catch (error) {
      setUploadError(error?.response?.data?.message || "Signature upload failed");
    } finally {
      setUploadingSignature(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (visitId) => {
    if (!patient) return;
    if (!window.confirm("Delete this visit?")) return;

    const res = await deleteVisit(patient._id, visitId);
    onPatientUpdated(res.data);

    if (editingVisitId === visitId) {
      resetFormState();
    }
  };

  if (!patient) {
    return (
      <div className="card">
        <h2>Visit Manager</h2>
        <p className="empty-state">Select a patient and click "Manage Visits" to view visit history.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="visit-header">
        <div>
          <h2>Visit Manager</h2>
          <p className="visit-subtitle">
            {patient.name} • {visits.length} visit{visits.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={handleAddNewClick}>
            Add Visit
          </button>
          {onClose && (
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>

      {visits.length === 0 && <p className="empty-state">No visits yet for this patient.</p>}

      <div className="visit-list section-card">
        <h3 className="section-title">Visits</h3>
        {visits.map((visit, index) => (
          <div key={visit._id || index} className="visit-item">
            <div>
              <strong>Visit #{index + 1}</strong>
              <p>Date: {visit.date || "—"}</p>
              <small>
                Vitals: H {visit.vitals.height || "-"}, W {visit.vitals.weight || "-"}, P {visit.vitals.pulse || "-"},
                BP {visit.vitals.bp || "-"}, T {visit.vitals.temp || "-"}, SpO₂ {visit.vitals.spo2 || "-"}
              </small>
            </div>

            <div className="actions">
              <button type="button" className="btn btn-secondary" onClick={() => handleEditClick(visit)}>
                Edit
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(visit._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(isAdding || editingVisitId) && (
        <form onSubmit={handleSave} className="form-stack visit-form section-card">
          <h3 className="section-title">{editingVisitId ? "Edit Visit" : "Add Visit"}</h3>

          <input name="date" placeholder="Visit Date" value={form.date} onChange={handleFieldChange} />

          <div className="form-grid">
            <input name="height" placeholder="Height" value={form.vitals.height} onChange={handleVitalChange} />
            <input name="weight" placeholder="Weight" value={form.vitals.weight} onChange={handleVitalChange} />
            <input name="pulse" placeholder="Pulse" value={form.vitals.pulse} onChange={handleVitalChange} />
            <input name="bp" placeholder="BP" value={form.vitals.bp} onChange={handleVitalChange} />
            <input name="temp" placeholder="Temperature" value={form.vitals.temp} onChange={handleVitalChange} />
            <input name="spo2" placeholder="SpO₂" value={form.vitals.spo2} onChange={handleVitalChange} />
          </div>

          <div className="section-card sub-section">
            <h3 className="section-title">Prescription</h3>
            <textarea name="symptoms" placeholder="Symptoms" value={form.symptoms} onChange={handleFieldChange} />
            <textarea
              name="prescription"
              placeholder="Prescription"
              value={form.prescription}
              onChange={handleFieldChange}
            />
            <input name="fee" placeholder="Consultation Fee" value={form.fee} onChange={handleFieldChange} />
          </div>

          <div className="upload-block">
            <label className="upload-label">Upload Lab Report</label>
            <input type="file" accept=".pdf,image/*" onChange={handleLabUpload} disabled={uploadingLab} />
            {uploadingLab && <small className="upload-status">Uploading lab report...</small>}
            {form.labReportUrl && (
              <a href={form.labReportUrl} target="_blank" rel="noreferrer">
                View uploaded lab report
              </a>
            )}
          </div>

          <div className="upload-block">
            <label className="upload-label">Upload Doctor Signature</label>
            <input type="file" accept="image/*" onChange={handleSignatureUpload} disabled={uploadingSignature} />
            {uploadingSignature && <small className="upload-status">Uploading signature...</small>}
            {form.doctorSignUrl && (
              <a href={form.doctorSignUrl} target="_blank" rel="noreferrer">
                View uploaded doctor signature
              </a>
            )}
          </div>

          <input
            name="labReportUrl"
            placeholder="Lab Report URL"
            value={form.labReportUrl}
            onChange={handleFieldChange}
          />
          <input
            name="doctorSignUrl"
            placeholder="Doctor Sign URL"
            value={form.doctorSignUrl}
            onChange={handleFieldChange}
          />

          {uploadError && <p className="error-text">{uploadError}</p>}

          <div className="actions">
            <button type="submit" className="btn btn-primary">
              {editingVisitId ? "Update Visit" : "Save Visit"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetFormState}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}