# Database Setup

This project uses **Prisma** with a local **PostgreSQL** database.

## Prerequisites

- PostgreSQL running locally (default port `5432`)
- Node.js and npm

## 1. Configure environment

Copy `.env.example` to `.env` and set your connection string:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/formbuilder?schema=public"
```

Create the database if it does not exist:

```bash
createdb formbuilder
```

## 2. Run migrations

```bash
npm run db:migrate
```

This creates the following tables:

- **User** — email/password accounts
- **Session** — auth sessions (httpOnly cookie)
- **Form** — form definitions (title + JSON schema)
- **FormResponse** — submitted answers per form

## 3. Generate Prisma Client

Run after schema changes:

```bash
npm run db:generate
```

## Useful commands

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Create and apply migrations |
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:studio` | Open Prisma Studio (DB browser) |
| `npm run db:push` | Push schema without migration (dev only) |

## Auth

Authentication is handled locally with bcrypt password hashing and database-backed sessions. No Supabase or external auth provider is required.
