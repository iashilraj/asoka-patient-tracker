import React, { useEffect, useState } from "react";
import { getPatients, addPatient, updatePatient, deletePatient } from "./api";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import "./App.css";


export default function App() {
const [patients, setPatients] = useState([]);
const [selected, setSelected] = useState(null);


const loadPatients = async () => {
const res = await getPatients();
setPatients(res.data);
};


useEffect(() => {
loadPatients();
}, []);


const handleSubmit = async (data) => {
if (selected) await updatePatient(selected._id, data);
else await addPatient(data);


setSelected(null);
loadPatients();
};


const handleDelete = async (id) => {
await deletePatient(id);
loadPatients();
};


return (
<div className="container">
<h1>Asoka Homoeo Clinic</h1>


<PatientForm
onSubmit={handleSubmit}
selected={selected}
clearSelection={() => setSelected(null)}
/>


<PatientList
patients={patients}
onEdit={setSelected}
onDelete={handleDelete}
/>
</div>
);
}