**Architecture**

Monorepo simple:

- `backend/` : API REST en Node.js + TypeScript (Express), Prisma ORM vers PostgreSQL
- `frontend/` : Next.js TypeScript app (React) pour les workflows utilisateur
- `docker-compose.yml` orchestre `db`, `backend`, `frontend`

Flux principal:

User -> Frontend (Next.js) -> Backend REST (/api/*) -> PostgreSQL

Composants backend:
- Auth (JWT)
- Questionnaire API
- Risk Engine (classification automatique)
- PDF generator
- Logging & Audit (winston + stockage DB)

Disponibilité & scalabilité:
- Stateless API containers derrière load-balancer
- PostgreSQL géré (replication) pour haute disponibilité
- Logs streamés vers ELK/Datadog en production

ERD (simple):

User 1---* RiskAssessment 1---* Answer
RiskAssessment 1---* Document
Audit (logs séparés)
