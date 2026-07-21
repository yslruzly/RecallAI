export const CHUNK_SIZE = 800;
export const CHUNK_OVERLAP = 100;

export function chunkText(text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    if (chunk.trim()) chunks.push(chunk);
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

export function cleanText(input: unknown): string {
  const text = Array.isArray(input) ? input.join(" ") : String(input);
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export async function embedText(text: string): Promise<number[]> {
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
  return data.data[0].embedding;
}