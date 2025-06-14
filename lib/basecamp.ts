let ACCESS = process.env.BC_ACCESS_TOKEN ?? "";
let REFRESH = process.env.BC_REFRESH_TOKEN ?? "";

const ACCOUNT  = process.env.BC_ACCOUNT_ID!;
const CID      = process.env.BC_CLIENT_ID!;
const CSECRET  = process.env.BC_CLIENT_SECRET!;

async function refresh() {
  if (!REFRESH) throw new Error("No refresh_token");
  const j = await fetch(
    "https://launchpad.37signals.com/authorization/token?type=refresh",
    { method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: CID, client_secret: CSECRET, refresh_token: REFRESH })
    }).then(r => r.json());
  ACCESS  = j.access_token;
  REFRESH = j.refresh_token ?? REFRESH;
}

export async function bc<T = any>(
  path: string,
  method: "GET" | "POST" = "GET",
  body?: Record<string, unknown>
): Promise<T> {
  if (!ACCESS) await refresh();
  const r = await fetch(
    `https://3.basecampapi.com/${ACCOUNT}${path}`,
    { method,
      headers: {
        Authorization: `Bearer ${ACCESS}`,
        "User-Agent": "WHQ-MCP",
        "Content-Type": "application/json"
      },
      body: method === "POST" ? JSON.stringify(body ?? {}) : undefined
    });
  if (r.status === 401 && REFRESH) { ACCESS = ""; return bc(path, method, body); }
  if (!r.ok) throw new Error(`BC ${r.status}: ${await r.text()}`);
  return r.json();
}