-- Run this in your Supabase SQL editor

-- Enable pgvector
create extension if not exists vector;

-- Documents table
create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

-- Chunks table with vector embedding column
create table if not exists chunks (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references documents(id) on delete cascade,
  document_name text not null,
  content text not null,
  embedding vector(1536),
  chunk_index integer,
  created_at timestamptz default now()
);

-- Index for fast similarity search
create index if not exists chunks_embedding_idx
  on chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Match chunks function used for retrieval
create or replace function match_chunks(
  query_embedding vector(1536),
  match_count int default 5,
  filter_doc_id uuid default null
)
returns table (
  id uuid,
  document_id uuid,
  document_name text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    c.id,
    c.document_id,
    c.document_name,
    c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  from chunks c
  where
    (filter_doc_id is null or c.document_id = filter_doc_id)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
