CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  entry TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  embedding VECTOR(1536)
);

CREATE INDEX IF NOT EXISTS idx_journal_embedding ON journal_entries USING ivfflat (embedding vector_cosine_ops);
