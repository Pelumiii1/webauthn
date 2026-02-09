## WebAuthn Demo (FastAPI + React)

Simple WebAuthn demo with a FastAPI backend and a React + Vite frontend.

## Project structure

- backend/ - FastAPI server that issues and verifies WebAuthn options
- frontend/ - React + TypeScript UI built with Vite

## Prerequisites

- Python 3.10+
- Node.js 18+ and pnpm

## Backend setup

From the repo root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn webauthn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API is available at http://localhost:8000.

## Frontend setup

From the repo root:

```bash
cd frontend
pnpm install
pnpm dev
```

The UI runs at http://localhost:5173.

## Configuration

The WebAuthn relying party settings live in [backend/main.py](backend/main.py):

- `RP_ID` is set to `localhost`
- `ORIGIN` is set to `http://localhost:5173`

If you change the frontend host or move to a real domain, update these values.

## API endpoints

- `GET /` - health check
- `POST /auth/register/options` - create registration options
- `POST /auth/register/verify` - verify a registration response
- `POST /auth/login/options` - create authentication options
- `POST /auth/login/verify` - verify an authentication response

## Notes

- This demo expects a modern browser with WebAuthn support and a compatible authenticator.
- The backend currently trusts payload fields as-is and does not persist credentials.

## Next ideas

- Persist users and credential data in a database.
- Add CSRF protection and stricter origin handling.
- Build a UI flow for register/login using the helper in [frontend/src/utils/webauthn.ts](frontend/src/utils/webauthn.ts).
