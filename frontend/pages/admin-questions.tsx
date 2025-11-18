import { useState } from 'react';
import axios from 'axios';

export default function AdminQuestions(){
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState('');

  const upload = async ()=>{
    try{
      const data = JSON.parse(jsonText);
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const r = await axios.post(`${base}/api/questionnaire/admin/upload`, data);
      setStatus('Upload OK: ' + JSON.stringify(r.data));
    }catch(e:any){
      setStatus('Erreur: '+ (e.message || e));
    }
  }

  return (
    <div className="container">
      <h2>Admin — Questions</h2>
      <p>Collez un tableau JSON de questions (id, code, text, annex, options).</p>
      <textarea rows={20} style={{width:'100%'}} value={jsonText} onChange={e=>setJsonText(e.target.value)} />
      <div style={{marginTop:8}}>
        <button onClick={upload}>Uploader</button>
      </div>
      <div style={{marginTop:12}}>{status}</div>
    </div>
  )
}
