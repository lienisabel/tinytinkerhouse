import Anthropic from "@anthropic-ai/sdk";

/* ---------------------------------------------------------------------
   Vercel serverless function: POST /api/claude
   Body: { system: string, prompt: string, maxTokens?: number }
   Returns: { text: string }

   Holds the ANTHROPIC_API_KEY server-side (set it in Vercel → Project →
   Settings → Environment Variables). Model can be overridden with the
   ANTHROPIC_MODEL env var.
--------------------------------------------------------------------- */

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
const MAX_PROMPT_CHARS = 20000;

const client = new Anthropic();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, prompt, maxTokens } = req.body || {};
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Missing prompt" });
  }
  if (prompt.length > MAX_PROMPT_CHARS || (system && system.length > MAX_PROMPT_CHARS * 3)) {
    return res.status(413).json({ error: "Request too large" });
  }

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: Math.min(Number(maxTokens) || 4000, 8000),
      // Simple JSON extraction — low effort keeps it quick and cheap.
      output_config: { effort: "low" },
      // If a safety classifier declines, let the API retry on a fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: typeof system === "string" ? system : undefined,
      messages: [{ role: "user", content: prompt }],
    });

    if (response.stop_reason === "refusal") {
      return res.status(422).json({ error: "The model declined this request" });
    }

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");
    return res.status(200).json({ text });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error("Anthropic API error", err.status, err.message);
      return res.status(err.status && err.status < 500 ? 502 : 503).json({ error: "AI service error" });
    }
    console.error(err);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
