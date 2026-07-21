import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });

  const res = await fetch("https://api.jina.ai/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.JINA_API_KEY}`,
    },
    body: JSON.stringify({
      model: "jina-embeddings-v2-base-en",
      input: [text.slice(0, 8000)],
    }),
  });

  const data = await res.json();
  return NextResponse.json({ embedding: data.data[0].embedding });
}