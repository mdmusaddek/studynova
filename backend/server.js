const express = require("express");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const auth = require("./auth/auth");
const aiRouter = require("./utils/aiRouter");
const pdfParse = require("pdf-parse");
dotenv.config();

const app = express();

const upload = multer({
    dest: "uploads/"
});
// ----------------------------
// CONFIG
// ----------------------------

const PORT = process.env.PORT || 3000;

const USERS_FILE = path.join(__dirname, "auth", "users.json");

// ----------------------------
// MIDDLEWARE
// ----------------------------

app.use(cors({
    origin: [
        "https://mdmusaddek.github.io",
        "http://localhost:3000"
    ],
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "novaos-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "none",
    secure: true
    }
}));

// Frontend files
app.use(express.static(path.join(__dirname, "..")));

// ----------------------------
// USER DATABASE HELPERS
// ----------------------------

function loadUsers() {

    if (!fs.existsSync(USERS_FILE)) {

        fs.mkdirSync(path.dirname(USERS_FILE), {
            recursive: true
        });

        fs.writeFileSync(
            USERS_FILE,
            JSON.stringify([], null, 2)
        );

    }

    return JSON.parse(
        fs.readFileSync(USERS_FILE, "utf8")
    );

}

function saveUsers(users) {

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users, null, 2)
    );

}
// ----------------------------
// START SERVER
// ----------------------------

app.get("/", (req, res) => {
    res.send("NovaOS Lite Backend v2 Running 🚀");
});

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on http://0.0.0.0:${PORT}`
    );

});
// ----------------------------------
// REGISTER
// ----------------------------------

app.post("/api/register", async (req, res) => {

    try {

        const {

            name,
            email,
            password

        } = req.body;

        const user =
            await auth.register(

                name,
                email,
                password

            );

        req.session.user = user;
req.session.history = user.memory || [];

        res.json({

            success: true,

            message:
                "Registration successful.",

            user

        });

    } catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

});
// ----------------------------------
// LOGIN
// ----------------------------------

app.post("/api/login", async (req, res) => {

    try {

        const {

            email,
            password

        } = req.body;

        const user = await auth.login(
            email,
            password
        );

        req.session.user = user;
req.session.memory = user.memory || [];

        res.json({

            success: true,

            message: "Login successful.",

            user

        });

    } catch (err) {

        res.status(401).json({

            success: false,

            message: err.message

        });

    }

});
// ----------------------------------
// LOGOUT
// ----------------------------------

app.post("/api/logout", (req, res) => {
req.session.history = [];
    req.session.destroy(err => {

        if (err) {

            return res.status(500).json({

                success: false,
                message: "Logout failed."

            });

        }

        res.clearCookie("connect.sid");

        res.json({

            success: true,
            message: "Logged out successfully."

        });

    });

});
// ----------------------------------
// CURRENT USER
// ----------------------------------

app.get("/api/me", (req, res) => {

    if (!req.session.user) {

        return res.status(401).json({

            success: false,
            message: "Not logged in."

        });

    }
res.json({

    success: true,
    user: req.session.user

});
});
// ----------------------------------
// AI CHAT
// ----------------------------------
// ----------------------------------
// AI CHAT
// ----------------------------------

app.post("/api/chat", async (req, res) => {

    console.log("===== /api/chat called =====");

    try {

        const { message } = req.body;


        if (!message) {

            return res.status(400).json({

                success: false,
                message: "Message is required."

            });

        }


        // Load permanent memory

        const history =
            req.session.user?.memory || [];


        console.log("Loaded Memory:");
        console.log(history);



        const messages = [

            {
                role: "system",

                content: `
You are Nova AI, the official AI assistant of StudyNova.

Your name is Nova AI.

Developer:
MD. Musaddek Hussain (Musa)

IMPORTANT PERSONAL PROFILE:

Developer information:

Name:
MD. Musaddek Hussain (Musa)

Website:
https://mdmusaddek.github.io/md.musaddek/

If anyone asks for Musa's photo, portrait, image, or wants to see Musa,
do not provide a fake image or claim you have an image.

Instead reply:

"আপনি MD. Musaddek Hussain (Musa)-এর ছবি দেখতে তার official website ভিজিট করতে পারেন:
https://mdmusaddek.github.io/md.musaddek/

সেখানে তার সম্পর্কে বিস্তারিত তথ্য ও ছবি দেখতে পারবেন।"

Personal Information:

Home Address:

Village:
মুক্তারবস্তি

Union:
ধর্মগড়

Upazila:
রানীশংকৈল

District:
ঠাকুরগাঁও

Country:
Bangladesh


Favorite Color:
সবুজ

Rules:

- Always introduce yourself as Nova AI.
- Never say you are ChatGPT.
- Never say you are Gemini.
- Never say you are Groq.
- Never say you are OpenRouter.
- greet the user with "Assalamualaikum" instead of Hello, Hi, or Namaskar.
- Reply in Bengali when the user writes in Bengali.
- Use respectful Islamic greeting style.
- StudyNova was developed by MD. Musaddek Hussain (Musa).

User memory:

${JSON.stringify(history)}
`
            },


            {
                role: "user",
                content: message
            }

        ];



        console.log("Messages sent to AI:");

        console.log(
            JSON.stringify(messages, null, 2)
        );



        const reply = await aiRouter(messages);



        console.log("AI Reply:");
        console.log(reply);



        // Update memory

        const updatedMemory = [

            ...history,

            {
                role: "user",
                content: message
            },

            {
                role: "assistant",
                content: reply
            }

        ].slice(-20);



        // Update session memory

        if (!req.session.user) {
    req.session.user = {};
}

req.session.user.memory = updatedMemory;



        // Update database

        const users = auth.loadUsers();


        const index = users.findIndex(

            u =>
            u.email === req.session.user.email

        );


        if (index !== -1) {

            users[index].memory =
                updatedMemory;

            auth.saveUsers(users);

            console.log(
                "Memory saved to users.json"
            );

        }



        res.json({

            success: true,

            reply

        });



    } catch (err) {


        console.error(err);


        res.status(500).json({

            success: false,

            message: err.message

        });


    }

});
// ----------------------------------
// PDF AI SUMMARY
// ----------------------------------

// ----------------------------------
// PDF AI SUMMARY
// ----------------------------------

app.post(
    "/api/pdf-summary",
    upload.single("pdf"),
    async (req, res) => {

        try {

            console.log("===== /api/pdf-summary called =====");


            if (!req.file) {

                return res.status(400).json({

                    success:false,

                    summary:"No PDF file uploaded."

                });

            }


            console.log("PDF File:");
            console.log(req.file);


            // Read PDF

            const dataBuffer = fs.readFileSync(
                req.file.path
            );


            const pdfData = await pdfParse(
                dataBuffer
            );


            const extractedText =
                pdfData.text;


            console.log(
                "Extracted text length:",
                extractedText.length
            );


            if (!extractedText.trim()) {

                return res.json({

                    success:false,

                    summary:"Could not extract text from PDF."

                });

            }


            // Send to Nova AI

            const messages = [

                {
                    role:"system",

                    content:`
You are Nova AI.

Summarize PDF documents clearly.

Return:

1. Short summary
2. Important key points
3. Main conclusion

Reply in Bengali if the document is Bengali.
`
                },


                {
                    role:"user",

                    content:
`Summarize this PDF:

${extractedText.slice(0,12000)}`
                }

            ];


            const summary =
                await aiRouter(messages);


            console.log("PDF Summary Generated");


            res.json({

                success:true,

                summary

            });


            // Delete temporary upload

            fs.unlinkSync(
                req.file.path
            );


        } catch(err) {


            console.error(
                "PDF ERROR:",
                err
            );


            res.status(500).json({

                success:false,

                summary:err.message

            });


        }

    }
);
