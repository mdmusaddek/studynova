const askOpenRouter = require("../providers/openrouter");
const askGroq = require("../providers/groq");
const askGemini = require("../providers/gemini");


async function aiRouter(messages) {


    const providers = [

        {
            name: "OpenRouter",
            fn: askOpenRouter
        },

        {
            name: "Groq",
            fn: askGroq
        },

        {
            name: "Gemini",
            fn: askGemini
        }

    ];



    for (const provider of providers) {


        try {


            console.log(`🚀 Trying ${provider.name}...`);


            const reply = await provider.fn(messages);



            console.log(`✅ ${provider.name} Success`);



            // User শুধু reply পাবে

            return reply;



        } catch (error) {



            console.log(
                `❌ ${provider.name} Failed:`,
                error.message
            );


        }

    }



    throw new Error(
        "All AI providers are unavailable."
    );


}



module.exports = aiRouter;