import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { embedText } from "@/lib/rag";

export async function POST(req: NextRequest) {
  const { question, documentId } = await req.json();
  if (!question) return new Response("No question", { status: 400 });

  const embedding = await embedText(question);
  if (!embedding) {
    return new Response(JSON.stringify({ answer: "Embedding failed.", sources: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: chunks, error } = await supabaseAdmin.rpc("match_chunks", {
    query_embedding: embedding,
    match_count: 5,
    filter_doc_id: documentId || null,
  });

  if (error) return new Response(error.message, { status: 500 });

  if (!chunks || chunks.length === 0) {
    return new Response(
      JSON.stringify({
        answer: "I couldn't find anything relevant in your notes. Try rephrasing your question.",
        sources: [],
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const context = chunks
    .map((c: { document_name: string; content: string }, i: number) =>
      `[Source ${i + 1} — ${c.document_name}]\n${c.content}`
    )
    .join("\n\n---\n\n");

  const sources = Array.from(new Set(chunks.map((c: { document_name: string }) => c.document_name)));

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a study assistant. Answer the question using ONLY the notes provided below. If the answer is not in the notes, say "I don't see this in your notes." Be concise and clear. Only use numbered lists when explicitly asked to create a quiz or list multiple items. For single questions, answer directly in plain paragraphs without numbering.

NOTES:
${context}

QUESTION: ${question}`,
        },
      ],
    }),
  });

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content || "No response.";

  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/eval`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      answer,
      context,
      document_name: sources[0] || "",
    }),
  }).catch(console.error);

  return new Response(JSON.stringify({ answer, sources }), {
    headers: { "Content-Type": "application/json" },
  });
}
