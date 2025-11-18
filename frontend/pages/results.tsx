import { useRouter } from 'next/router';
import axios from 'axios';

export default function Results() {
  const router = useRouter();
  const { res } = router.query;
  const data = res ? JSON.parse(String(res)) : null;

  const downloadPDF = async (type: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const resp = await axios.post(`${base}/api/pdf`, data || {}, { responseType: 'blob', params: { type } });
      const url = window.URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert('Erreur génération PDF');
    }
  }

  return (
    <div className="container">
      <h2>Résultats</h2>
      {data ? (
        <div>
          <p><strong>Classification:</strong> {data.classification}</p>
          <p><strong>Motif:</strong> {data.reason || data.classification}</p>
          <h3>Obligations identifiées</h3>
          <ul>
            {(data.obligations || []).map((o:any)=>(<li key={o.code}><strong>{o.code}</strong>: {o.title}</li>))}
          </ul>
          <div style={{marginTop:12}}>
            <button onClick={()=>downloadPDF('diagnostic')}>Télécharger Rapport Diagnostic (PDF)</button>
            <button onClick={()=>downloadPDF('tech')}>Documentation Technique (PDF)</button>
            <button onClick={()=>downloadPDF('conformity')}>Rapport de Conformité (PDF)</button>
            <button onClick={()=>downloadPDF('declaration')}>Déclaration UE (Annexe V)</button>
          </div>
        </div>
      ) : (
        <pre>Aucun résultat</pre>
      )}
    </div>
  )
}
