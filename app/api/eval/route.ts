import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { question, answer, context, document_name } = await req.json();

  const prompt = `You are an AI evaluation system. Score the following answer on 3 metrics.
Return ONLY a JSON object, no other text, no markdown.

QUESTION: ${question}
CONTEXT: ${context}
ANSWER: ${answer}

Score each metric from 0 to 1:
- faithfulness: Is the answer supported by the context? (1 = fully supported, 0 = hallucinated)
- relevance: Does the answer address the question? (1 = fully relevant, 0 = off-topic)
- completeness: Does the answer cover the key points? (1 = complete, 0 = missing key info)

Return exactly this format:
{"faithfulness": 0.0, "relevance": 0.0, "completeness": 0.0}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    }),
  });

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "{}";

  let scores = { faithfulness: 0, relevance: 0, completeness: 0 };
  try {
    scores = JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch (e) {
    console.error("Failed to parse eval scores:", raw);
  }

  const { error } = await supabaseAdmin.from("evals").insert({
    question,
    answer,
    document_name,
    faithfulness: scores.faithfulness,
    relevance: scores.relevance,
    completeness: scores.completeness,
  });

  if (error) console.error("Eval insert error:", error);

  return NextResponse.json(scores);
}