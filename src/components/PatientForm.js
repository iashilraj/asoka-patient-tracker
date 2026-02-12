import React, { useState, useEffect } from "react";

export default function PatientForm({ onSubmit, selected, clearSelection }) {
  const emptyForm = {
    name: "",
    age: "",
    sex: "",
    dob: "",
    address: "",
    mobile: "",
    email: "",
    refId: "",
    guardianName: "",
    idProof: "",
    occupation: "",

    diagnosis: "",
    provisionalDiagnosis: "",
    clinicalHistory: "",
    familyHistory: "",

    firstVisit: {
      date: "",
      height: "",
      weight: "",
      pulse: "",
      bp: "",
      temp: "",
      spo2: "",
      symptoms: "",
      prescription: "",
      fee: "",
    },
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVisitChange = (e) => {
    setForm({
      ...form,
      firstVisit: { ...form.firstVisit, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(emptyForm);
  };

  return (
    <div className="card">
      <h2>{selected ? "Edit Patient" : "Add Patient"}</h2>

      <form onSubmit={handleSubmit}>
        {/* ===== Preliminary Details ===== */}
        <h3>Preliminary Details</h3>

        <input name="name" placeholder="Patient Name" value={form.name} onChange={handleChange} required />
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
        <input name="sex" placeholder="Sex" value={form.sex} onChange={handleChange} />
        <input name="dob" placeholder="DOB" value={form.dob} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="refId" placeholder="Patient Ref ID" value={form.refId} onChange={handleChange} />
        <input name="guardianName" placeholder="Guardian / Spouse Name" value={form.guardianName} onChange={handleChange} />
        <input name="idProof" placeholder="ID Proof" value={form.idProof} onChange={handleChange} />
        <input name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} />

        {/* ===== Diagnosis ===== */}
        <h3>Diagnosis</h3>

        <textarea name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} />
        <textarea name="provisionalDiagnosis" placeholder="Provisional Diagnosis" value={form.provisionalDiagnosis} onChange={handleChange} />
        <textarea name="clinicalHistory" placeholder="Clinical & Treatment History" value={form.clinicalHistory} onChange={handleChange} />
        <textarea name="familyHistory" placeholder="Family History" value={form.familyHistory} onChange={handleChange} />

        {/* ===== First Visit ===== */}
        <h3>First Visit Details</h3>

        <input name="date" placeholder="Visit Date" value={form.firstVisit.date} onChange={handleVisitChange} />

        <input name="height" placeholder="Height" value={form.firstVisit.height} onChange={handleVisitChange} />
        <input name="weight" placeholder="Weight" value={form.firstVisit.weight} onChange={handleVisitChange} />
        <input name="pulse" placeholder="Pulse" value={form.firstVisit.pulse} onChange={handleVisitChange} />
        <input name="bp" placeholder="BP" value={form.firstVisit.bp} onChange={handleVisitChange} />
        <input name="temp" placeholder="Temperature" value={form.firstVisit.temp} onChange={handleVisitChange} />
        <input name="spo2" placeholder="SpO₂" value={form.firstVisit.spo2} onChange={handleVisitChange} />

        <textarea name="symptoms" placeholder="Presenting Symptoms" value={form.firstVisit.symptoms} onChange={handleVisitChange} />
        <textarea name="prescription" placeholder="Prescription (Medicine, dosage, repetition)" value={form.firstVisit.prescription} onChange={handleVisitChange} />
        <input name="fee" placeholder="Consultation Fee" value={form.firstVisit.fee} onChange={handleVisitChange} />

        {/* ===== Buttons ===== */}
        <button type="submit">{selected ? "Update Patient" : "Add Patient"}</button>

        {selected && (
          <button type="button" onClick={clearSelection}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
