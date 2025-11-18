import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RiskManagement(){
  const [controls, setControls] = useState<any[]>([]);
  const [mitigations, setMitigations] = useState<any[]>([]);
  const [form, setForm] = useState({ code:'', title:'', description:'' });

  useEffect(()=>{
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    axios.get(`${base}/api/risk-management/controls`).then(r=>setControls(r.data));
    axios.get(`${base}/api/risk-management/mitigations`).then(r=>setMitigations(r.data));
  }, []);

  const addControl = async ()=>{
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    const r = await axios.post(`${base}/api/risk-management/controls`, form);
    setControls([r.data,...controls]);
    setForm({ code:'', title:'', description:'' });
  }

  return (
    <div className="container">
      <h2>Gestion des risques</h2>
      <section>
        <h3>Créer un contrôle (mitigation)</h3>
        <input placeholder="Code" value={form.code} onChange={e=>setForm({...form, code:e.target.value})} />
        <input placeholder="Titre" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <button onClick={addControl}>Créer</button>
      </section>
      <section>
        <h3>Contrôles existants</h3>
        <ul>{controls.map(c=>(<li key={c.id}><strong>{c.code}</strong> — {c.title}</li>))}</ul>
      </section>
      <section>
        <h3>Plans de mitigation</h3>
        <ul>{mitigations.map(m=>(<li key={m.id}>Assess: {m.assessmentId} — Control: {m.controlId} — Status: {m.status}</li>))}</ul>
      </section>
    </div>
  )
}
