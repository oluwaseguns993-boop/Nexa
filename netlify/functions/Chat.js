exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: [{ type: "text", text: "ERROR: API key not found." }]
      })
    };
  }
  try {
    const { messages } = JSON.parse(event.body);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are NEXA, an AI-powered Life Operating System. You are deeply empathetic, warm, non-judgmental, calm, practical and empowering. Help users with life direction, goal setting, career, finances, habits, emotional clarity and personal growth. Ask one focused follow-up question per response. Keep responses to 2-4 short paragraphs.`,
        messages
      })
    });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: [{ type: "text", text: "ERROR: " + err.message }]
      })
    };
  }
};
