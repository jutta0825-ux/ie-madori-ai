// Netlify Function: keep OPENAI_API_KEY on the server, never in browser code.
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return { statusCode: 503, body: JSON.stringify({ error: "OPENAI_API_KEY is not configured" }) };
  }
  try {
    const input = JSON.parse(event.body || "{}");
    const prompt = `あなたは住宅間取りの初期検討を支援するアシスタントです。建築基準法や構造安全性を保証せず、概念的な3案をJSONで返してください。
入力条件: ${JSON.stringify(input)}
JSONのみを返す。形式:
{"plans":[{"name":"A案｜生活動線","description":"特徴と注意点","entrance":"南","rooms":[{"name":"LDK","x":10,"y":10,"w":42,"h":30,"door":"開き戸","window":"南側"}]}]}
必須: plansを3つ。各案は部屋名、x/y/w/hの数値（SVGの概念座標、xは2-85、yは8-80、wは10-45、hは10-30程度）、door、windowを含むrooms配列を持つ。入力された必要室をできるだけ反映。3案の方針を変える。部屋同士の重なりをなるべく避け、外枠290x250内に収める。単位は実寸ではなく概念配置の座標。`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        messages: [
          { role: "system", content: "Return valid JSON only. Do not include markdown fences." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      return { statusCode: 502, body: JSON.stringify({ error: "AI provider request failed", detail }) };
    }
    const data = await response.json();
    const result = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    if (!Array.isArray(result.plans)) throw new Error("AI response did not contain plans");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ plans: result.plans.slice(0, 3) })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Could not generate plans", detail: String(error.message || error) }) };
  }
};