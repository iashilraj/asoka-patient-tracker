import React, { useState, useEffect } from "react";


export default function PatientForm({ onSubmit, selected, clearSelection }) {
const [form, setForm] = useState({
name: "",
phone: "",
healthHistory: "",
});


useEffect(() => {
if (selected) setForm(selected);
}, [selected]);


const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};


const handleSubmit = (e) => {
e.preventDefault();
onSubmit(form);
setForm({ name: "", phone: "", healthHistory: "" });
};


return (
<div className="card">
<h2>{selected ? "Edit Patient" : "Add Patient"}</h2>
<form onSubmit={handleSubmit}>
<input name="name" placeholder="Patient Name" value={form.name} onChange={handleChange} required />
<input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
<textarea name="healthHistory" placeholder="Health History" value={form.healthHistory} onChange={handleChange} />


<button type="submit">{selected ? "Update" : "Add"}</button>
{selected && (
<button type="button" onClick={clearSelection}>
Cancel
</button>
)}
</form>
</div>
);
}
