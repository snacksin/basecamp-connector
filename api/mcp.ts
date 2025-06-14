import type { VercelRequest, VercelResponse } from "@vercel/node";
import { bc } from "../lib/basecamp.js";

/* --- JSON-Schema array (same 14 tools as before) --- */
const SCHEMA = { tools: [ /* …exact blocks from prior answer… */ ] };

export default async function mcp(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/event-stream");
    res.write(`event: schema\ndata: ${JSON.stringify(SCHEMA)}\n\n`);
    const ping = setInterval(() => res.write("event: ping\ndata: {}\n\n"), 25_000);
    req.on("close", () => clearInterval(ping));
    return;
  }

  if (req.method === "POST" && req.headers.accept?.includes("text/event-stream")) {
    const { tool, args = {} } = req.body as { tool: string; args: any };
    try {
      const data = await route(tool, args);         // ← include full router + helpers
      res.setHeader("Content-Type", "text/event-stream");
      res.write(`event: tool_response\ndata: ${JSON.stringify(data)}\n\n`);
    } catch (e: any) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: e.message })}\n\n`);
    }
    res.end(); return;
  }

  res.status(404).json({ error: "Nope" });
}

/* Paste the full 'route', helpers, etc. from the previous reply */