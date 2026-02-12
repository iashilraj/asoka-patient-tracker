import React, { useMemo, useState } from "react";

export default function PatientList({
  patients,
  onEdit,
  onDelete,
  onManageVisits,
  onPrintCaseSheet,
  activePatientId,
  onSelectPatient,
}) {
  const [search, setSearch] = useState("");

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return patients;

    return patients.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const mobile = String(p.mobile || p.phone || "").toLowerCase();
      const refId = String(p.refId || "").toLowerCase();

      return name.includes(query) || mobile.includes(query) || refId.includes(query);
    });
  }, [patients, search]);

  return (
    <div className="card">
      <h2>Patients</h2>

      <input
        className="patient-search"
        type="text"
        placeholder="Search by name, mobile, or ref ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredPatients.length === 0 && (
        <p className="empty-state">No matching patients found.</p>
      )}

      {filteredPatients.map((p) => (
        <div
          key={p._id}
          className={`patient ${activePatientId === p._id ? "patient-selected" : ""}`}
          onClick={() => onSelectPatient && onSelectPatient(p)}
        >
          <div>
            <strong>{p.name}</strong>
            <p>{p.mobile || p.phone || "No phone"}</p>
            <small>Ref ID: {p.refId || "N/A"}</small>
          </div>

          <div className="actions">
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(p);
              }}
            >
              Edit
            </button>

            {onManageVisits && (
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onManageVisits(p);
                }}
              >
                Manage Visits
              </button>
            )}

            {onPrintCaseSheet && (
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrintCaseSheet(p);
                }}
              >
                Print Case Sheet
              </button>
            )}

            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(p._id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}