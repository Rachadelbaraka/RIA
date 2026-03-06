# RIA Check & Go

Plateforme prototype pour aider les entreprises à se conformer au Règlement sur l'Intelligence Artificielle (RIA / AI Act).

Structure:
- `backend/` : API Node.js + TypeScript, Prisma, PostgreSQL
- `frontend/` : Next.js TypeScript app
- `infra/` : Dockerfiles, compose, infra helpers

Voir `docker-compose.yml` pour lancer localement.

Pour la première mise en route:

```bash
# copier .env.example -> .env
cp .env.example .env
docker compose up --build
```

Ce dépôt contient un scaffold complet. Développement ultérieur: questionnaire dynamique, classification des risques, génération PDF, logs et audits.
# RIAChange 1
Change 2
