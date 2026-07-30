const supabaseUrl = "https://gpfktbqeylspemolasfp.supabase.co";
const supabaseAnonKey = "sb_publishable_a2TMYBxpxRUuOCDYNhbPTA_lEM3km-d";
const tableName = "family_data";

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const familyKey = req.query.familyKey || "kriauklyciu-nuotykis-main-family";
  const headers = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates"
  };

  try {
    if (req.method === "GET") {
      const url = `${supabaseUrl}/rest/v1/${tableName}?familyKey=eq.${encodeURIComponent(familyKey)}&select=dataJson,updatedAt&limit=1`;
      const response = await fetch(url, { headers });
      const text = await response.text();
      res.statusCode = response.status;
      res.setHeader("Content-Type", response.headers.get("content-type") || "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store, max-age=0");
      res.end(text);
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      let dataJson = body.dataJson;

      if (body.taskConfig && typeof body.taskConfig === "object") {
        const readUrl = `${supabaseUrl}/rest/v1/${tableName}?familyKey=eq.${encodeURIComponent(familyKey)}&select=dataJson&limit=1`;
        const readResponse = await fetch(readUrl, { headers });
        if (!readResponse.ok) {
          const text = await readResponse.text();
          res.statusCode = readResponse.status;
          res.end(text);
          return;
        }
        const rows = await readResponse.json();
        const existing = rows?.[0]?.dataJson;
        if (!existing || typeof existing !== "object") {
          send(res, 404, { error: "Family data not found" });
          return;
        }
        dataJson = {
          ...existing,
          customTasks: body.taskConfig.customTasks,
          customTasksUpdatedAt: body.taskConfig.customTasksUpdatedAt,
          updatedAt: new Date().toISOString()
        };
      }

      const payload = {
        familyKey,
        dataJson,
        updatedAt: new Date().toISOString()
      };
      const url = `${supabaseUrl}/rest/v1/${tableName}?on_conflict=familyKey`;
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      const text = await response.text();
      res.statusCode = response.status;
      res.setHeader("Content-Type", response.headers.get("content-type") || "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store, max-age=0");
      res.end(text || "{}");
      return;
    }

    send(res, 405, { error: "Method not allowed" });
  } catch (error) {
    send(res, 500, { error: "Family data proxy failed" });
  }
};
