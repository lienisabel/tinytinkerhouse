/* ---------------------------------------------------------------------
   Browser-side helper for the AI features ("Paste a caption" parsing and
   "Generate with AI"). Calls our own /api/claude serverless function so
   the Anthropic API key never ships to the browser. Resolves to the
   model's text reply.
--------------------------------------------------------------------- */

export async function askClaude({ system, prompt, maxTokens }) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, prompt, maxTokens }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  if (!data.text) throw new Error("Empty response");
  return data.text;
}
