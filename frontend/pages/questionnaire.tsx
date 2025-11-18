import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Questionnaire() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const router = useRouter();

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    axios.get(`${base}/api/questionnaire/questions`).then(r => setQuestions(r.data));
  }, []);

  const handleSubmit = async () => {
    const payload = { userId: 'anonymous', answers: Object.keys(answers).map(k=>({ questionId: k, value: answers[k] })) };
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    const r = await axios.post(`${base}/api/questionnaire/submit`, payload);
    router.push({ pathname: '/results', query: { res: JSON.stringify(r.data) } });
  }

  return (
    <div className="container">
      <h2>Questionnaire RIA</h2>
      {questions.map(q => (
        <div key={q.id} className="question">
          <p>{q.text}</p>
          <select onChange={e=>setAnswers({...answers, [q.id]: e.target.value})}>
            <option value="">-- choisir --</option>
            {q.options.map((o:any)=>(<option key={o} value={o}>{o}</option>))}
          </select>
        </div>
      ))}
      <button onClick={handleSubmit}>Soumettre</button>
    </div>
  )
}
