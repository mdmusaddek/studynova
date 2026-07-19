const dotenv = require("dotenv");

dotenv.config();

async function askOpenRouter(messages) {

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "NovaOS Lite"
            },
            body: JSON.stringify({
                model: "openai/gpt-4.1-mini",
                max_tokens: 1024,
                messages
            })
        }
    );

    if (!response.ok) {
        throw new Error(`OpenRouter HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
        throw new Error(result.error.message);
    }

    return result.choices?.[0]?.message?.content || "No response.";

}

module.exports = askOpenRouter;