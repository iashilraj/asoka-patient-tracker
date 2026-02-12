import React, { useState, useEffect } from "react";

export default function PatientForm({ onSubmit, selected, clearSelection }) {
  const emptyFirstVisit = {
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
    labReportUrl: "",
    doctorSignUrl: "",
  };

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

    firstVisit: emptyFirstVisit,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (selected) {
      const visit = selected?.visits?.[0] || selected?.firstVisit || {};

      setForm({
        ...emptyForm,
        ...selected,
        firstVisit: {
          ...emptyFirstVisit,
          date: visit.date || "",
          height: visit?.vitals?.height ?? visit.height ?? "",
          weight: visit?.vitals?.weight ?? visit.weight ?? "",
          pulse: visit?.vitals?.pulse ?? visit.pulse ?? "",
          bp: visit?.vitals?.bp ?? visit.bp ?? "",
          temp: visit?.vitals?.temp ?? visit.temp ?? "",
          spo2: visit?.vitals?.spo2 ?? visit.spo2 ?? "",
          symptoms: visit.symptoms || "",
          prescription: visit.prescription || "",
          fee: visit.fee || "",
          labReportUrl: visit.labReportUrl || "",
          doctorSignUrl: visit.doctorSignUrl || "",
        },
      });
    } else {
      setForm(emptyForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const payload = {
      ...form,
      visits: [
        {
          date: form.firstVisit.date,
          vitals: {
            height: form.firstVisit.height,
            weight: form.firstVisit.weight,
            pulse: form.firstVisit.pulse,
            bp: form.firstVisit.bp,
            temp: form.firstVisit.temp,
            spo2: form.firstVisit.spo2,
          },
          symptoms: form.firstVisit.symptoms,
          prescription: form.firstVisit.prescription,
          fee: form.firstVisit.fee,
          labReportUrl: form.firstVisit.labReportUrl,
          doctorSignUrl: form.firstVisit.doctorSignUrl,
        },
      ],
    };

    delete payload.firstVisit;

    onSubmit(payload);
    setForm(emptyForm);
  };

  return (
    <div className="card">
      <h2>{selected ? "Edit Patient" : "Add Patient"}</h2>

      <form onSubmit={handleSubmit} className="form-stack">
        <div className="section-card">
          <h3 className="section-title">Patient Details</h3>

          <div className="form-grid">
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
          </div>
        </div>

        <div className="section-card">
          <h3 className="section-title">Diagnosis & Histories</h3>

          <textarea name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} />
          <textarea name="provisionalDiagnosis" placeholder="Provisional Diagnosis" value={form.provisionalDiagnosis} onChange={handleChange} />
          <textarea name="clinicalHistory" placeholder="Clinical & Treatment History" value={form.clinicalHistory} onChange={handleChange} />
          <textarea name="familyHistory" placeholder="Family History" value={form.familyHistory} onChange={handleChange} />
        </div>

        <div className="section-card">
          <h3 className="section-title">Prescription (Initial Visit)</h3>

          <input name="date" placeholder="Visit Date" value={form.firstVisit.date} onChange={handleVisitChange} />

          <div className="form-grid">
            <input name="height" placeholder="Height" value={form.firstVisit.height} onChange={handleVisitChange} />
            <input name="weight" placeholder="Weight" value={form.firstVisit.weight} onChange={handleVisitChange} />
            <input name="pulse" placeholder="Pulse" value={form.firstVisit.pulse} onChange={handleVisitChange} />
            <input name="bp" placeholder="BP" value={form.firstVisit.bp} onChange={handleVisitChange} />
            <input name="temp" placeholder="Temperature" value={form.firstVisit.temp} onChange={handleVisitChange} />
            <input name="spo2" placeholder="SpO₂" value={form.firstVisit.spo2} onChange={handleVisitChange} />
          </div>

          <textarea name="symptoms" placeholder="Presenting Symptoms" value={form.firstVisit.symptoms} onChange={handleVisitChange} />
          <textarea name="prescription" placeholder="Prescription (Medicine, dosage, repetition)" value={form.firstVisit.prescription} onChange={handleVisitChange} />
          <input name="fee" placeholder="Consultation Fee" value={form.firstVisit.fee} onChange={handleVisitChange} />
          <input name="labReportUrl" placeholder="Lab Report URL" value={form.firstVisit.labReportUrl} onChange={handleVisitChange} />
          <input name="doctorSignUrl" placeholder="Doctor Sign URL" value={form.firstVisit.doctorSignUrl} onChange={handleVisitChange} />
        </div>

        {/* ===== Buttons ===== */}
        <div className="actions">
          <button type="submit" className="btn btn-primary">{selected ? "Update Patient" : "Add Patient"}</button>

          {selected && (
            <button type="button" className="btn btn-secondary" onClick={clearSelection}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
