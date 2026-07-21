import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { chunkText, cleanText, embedText } from "@/lib/rag";

async function extractText(file: File): Promise<string> {
  if (file.name.toLowerCase().endsWith(".pdf")) {
    const { extractText: extract } = await import("unpdf");
    const buf = new Uint8Array(await file.arrayBuffer());
    const { text } = await extract(buf);
    return Array.isArray(text) ? text.join(" ") : text;
  }
  return file.text();
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let name: string;
    let text: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
      name = file.name;
      text = await extractText(file);
    } else {
      const body = await req.json();
      name = body.name;
      text = body.text;
    }

    if (!name || !text) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const cleaned = cleanText(text);
    const chunks = chunkText(cleaned);

    const { data: doc, error: docError } = await supabaseAdmin
      .from("documents")
      .insert({ name })
      .select()
      .single();

    if (docError) return NextResponse.json({ error: docError.message }, { status: 500 });

    const embedResults: number[][] = [];
    for (const chunk of chunks) {
      const embedding = await embedText(chunk);
      embedResults.push(embedding);
    }

    const rows = chunks.map((content, i) => ({
      document_id: doc.id,
      document_name: name,
      content,
      embedding: embedResults[i],
      chunk_index: i,
    }));

    const { error: chunkError } = await supabaseAdmin.from("chunks").insert(rows);
    if (chunkError) return NextResponse.json({ error: chunkError.message }, { status: 500 });

    return NextResponse.json({ documentId: doc.id, chunks: chunks.length });
  } catch (err: any) {
    console.error("Ingest error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ documents: data });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("documents").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}