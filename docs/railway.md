# Deploying Odysseus on Railway

Railway can run the main Odysseus Docker image. The deployment uses the
platform-provided `PORT` and the existing `/api/health` liveness endpoint.

## Required production settings

1. Deploy the repository as a Dockerfile service. The checked-in
   `.railway/railway.ts` file describes the production infrastructure.
2. Attach a persistent volume at `/app/data` (the infrastructure definition
   creates it automatically). This keeps authentication,
   settings, API keys, sessions, uploads, and the SQLite database across
   deployments.
3. Generate a public Railway domain for the service.
4. Keep these service variables set:

   ```text
   AUTH_ENABLED=true
   LOCALHOST_BYPASS=false
   SECURE_COOKIES=true
   ODYSSEUS_DATA_DIR=/app/data
   DATABASE_URL=sqlite:////app/data/app.db
   ```

5. Set `ODYSSEUS_ADMIN_PASSWORD` to a strong first-login password before the
   initial deployment. Once `/app/data/auth.json` exists, the persisted account
   is authoritative.

## Add an OpenAI API key

Sign in to the deployed app, open **Settings**, then **API Keys**, and add the
OpenAI key there. Do not commit the key to the repository. Odysseus stores the
configured credential under the persistent data directory.

## Optional services

The single-service deployment supports OpenAI chat without the local Compose
dependencies. ChromaDB-backed vector memory and bundled SearXNG search remain
degraded until separate Railway services are provisioned and their private
network addresses are supplied through `CHROMADB_HOST`, `CHROMADB_PORT`, and
`SEARXNG_INSTANCE`.

Machine-local features such as host Docker access, local Ollama discovery, and
GPU model serving are not available in a standard Railway container.
