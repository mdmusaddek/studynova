const dotenv = require("dotenv");

dotenv.config();

async function askGemini(messages) {

    const prompt = messages
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n\n");

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
        throw new Error(result.error.message);
    }

    return (
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response."
    );

}

module.exports = askGemini;