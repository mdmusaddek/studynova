const dotenv = require("dotenv");

dotenv.config();

async function askGroq(messages) {

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages,
                max_tokens: 1024,
                temperature: 0.7
            })
        }
    );


    if (!response.ok) {

        throw new Error(
            `Groq HTTP ${response.status}`
        );

    }


    const result = await response.json();


    if (result.error) {

        throw new Error(
            result.error.message
        );

    }


    return (
        result.choices?.[0]?.message?.content ||
        "No response."
    );

}


module.exports = askGroq;