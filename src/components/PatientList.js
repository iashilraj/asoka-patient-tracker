import React from "react";


export default function PatientList({ patients, onEdit, onDelete }) {
return (
<div className="card">
<h2>Patients</h2>


{patients.length === 0 && <p>No patients added yet.</p>}


{patients.map((p) => (
<div key={p._id} className="patient">
<div>
<strong>{p.name}</strong>
<p>{p.phone}</p>
<small>{p.healthHistory}</small>
</div>


<div className="actions">
<button onClick={() => onEdit(p)}>Edit</button>
<button onClick={() => onDelete(p._id)}>Delete</button>
</div>
</div>
))}
</div>
);
}