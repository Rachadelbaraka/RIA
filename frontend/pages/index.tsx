import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <header>
        <h1>RIA Check & Go</h1>
        <nav>
          <Link href="/questionnaire">Questionnaire</Link> | <Link href="/dashboard">Dashboard</Link> | <Link href="/risk-management">Risk Mgmt</Link> | <Link href="/contact">Contact</Link>
        </nav>
      </header>
      <main>
        <h2>Bienvenue</h2>
        <p>Outil d'aide à la conformité RIA — prototype.</p>
        <p style={{fontSize: '0.8rem', color: '#666'}}>Random change 2: un petit ajout de texte.</p>
      </main>
    </div>
  )
}
