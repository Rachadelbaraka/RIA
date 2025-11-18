export function mapObligationsForAnswers(answers: any[]) {
  // Return a list of obligation objects { code, title, description, relatedArticles }
  const obligations: Array<{ code: string; title: string; description?: string; relatedArticles?: string[] }> = [];
  // normalize and remove diacritics for robust matching
  const rawText = answers.map(a => `${String(a.questionId || '')} ${String(a.code || '')} ${String(a.text || '')}`).join(' ');
  const text = rawText.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  // If system affects fundamental rights or decisions -> Art. 9 (risk management)
  if (text.includes('decision') || text.includes('decisions') || text.includes('impact_individual') || text.includes('d ecision') || text.includes('decisio')) {
    obligations.push({ code: 'A9', title: 'Système de gestion des risques', description: 'Mettre en place un système de gestion des risques (Art.9)', relatedArticles: ['Art.9'] });
  }

  // Data governance
  if (text.includes('data') || text.includes('donnee') || text.includes('sant') || text.includes('biometr') || text.includes('biomet')) {
    obligations.push({ code: 'A10', title: 'Gouvernance et qualité des données', description: 'Respect des exigences pour la qualité et gouvernance des données (Art.10)', relatedArticles: ['Art.10'] });
  }

  // Documentation technique - Annexe IV
  if (text.length > 0) {
    obligations.push({ code: 'ANNEXE_IV', title: 'Documentation technique (Annexe IV)', description: 'Préparer la documentation technique détaillée', relatedArticles: ['Annexe IV'] });
  }

  // Journalisation & logs (Art.12)
  obligations.push({ code: 'A12', title: 'Journalisation & logs', description: 'Assurer journalisation complète pour audit (Art.12)', relatedArticles: ['Art.12'] });

  // Transparence & information (Art.13..)
  obligations.push({ code: 'A13', title: 'Transparence et information', description: 'Informer les utilisateurs sur le fonctionnement et les risques', relatedArticles: ['Art.13'] });

  // Déclaration UE (Annexe V) - if high risk or inacceptable
  if (text.includes('infrastructure') || text.includes('sensitive') || text.includes('biometr') || text.includes('biomet')) {
    obligations.push({ code: 'ANNEXE_V', title: 'Déclaration UE (Annexe V)', description: 'Préparer la déclaration à soumettre', relatedArticles: ['Annexe V'] });
  }

  // Deduplicate by code
  const unique = Object.values(obligations.reduce((acc, o) => { acc[o.code] = o; return acc; }, {} as Record<string, any>));
  return unique;
}

export async function lookupObligationsByCodes(codes: string[]) {
  // placeholder for future DB lookup mapping
  return codes.map(code => ({ code, title: code }));
}
