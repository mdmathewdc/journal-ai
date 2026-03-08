# Journal AI - Semantic Search using Vector Embeddings

A PostgreSQL + pgvector system to store journal entries and answer natural language questions via vector similarity search.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up PostgreSQL with pgvector

Run the Docker container with pgvector support:

```bash
docker run -d \
  --name journal-db \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  ankane/pgvector
```

### 3. Initialize Database Schema

Connect to the PostgreSQL database and run the schema:

```bash
psql -U postgres -h localhost -d postgres -f schema.sql
```

### 4. Configure Environment Variables

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```

### 5. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Save a Journal Entry

**POST** `/journal`

Request:

```json
{
  "entry": "played tennis with nicey after work"
}
```

Response:

```json
{
  "status": "saved"
}
```

### Ask a Question

**POST** `/ask`

Request:

```json
{
  "question": "what racket sports did i play in the last 2 weeks?"
}
```

Response:

```json
{
  "answer": "You played tennis, badminton, and squash in the last two weeks.",
  "matches": [
    {
      "id": 1,
      "entry": "played tennis with nicey after work",
      "created_at": "2026-03-08T06:34:01.517Z"
    },
    {
      "id": 2,
      "entry": "tried badminton with coworkers",
      "created_at": "2026-03-08T06:34:02.000Z"
    },
    {
      "id": 4,
      "entry": "played squash at the gym",
      "created_at": "2026-03-08T06:34:03.000Z"
    }
  ]
}
```

## How It Works

1. **Question** is converted to an embedding using OpenAI's text-embedding-3-small model
2. **PostgreSQL pgvector** performs similarity search using the `<=>` operator (cosine distance)
3. **Top 5 matching entries** are retrieved from the database
4. **GPT-4o-mini** generates a natural language answer using the retrieved entries as context

## Testing with Sample Data

```bash
# Seed the database
npm run seed

# Or add entries manually
curl -X POST http://localhost:3000/journal \
  -H "Content-Type: application/json" \
  -d '{"entry": "played tennis with sam after work"}'

# Ask a question
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "what racket sports did i play?"}'
```