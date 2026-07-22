"use strict";
console.log("AI.JS LOADED");
/* ==========================================
   Nova AI
   Part 1
========================================== */

const API = "https://studynova-jyrg.onrender.com";

const chatWindow =
document.getElementById("chatWindow");

const chatInput =
document.getElementById("chatInput");

const sendMessageButton =
document.getElementById("sendMessage");

const clearChatButton =
document.getElementById("clearChat");

const CHAT_STORAGE_KEY =
"nova-ai-chat";

/* ---------- Add Message ---------- */

/* ---------- Add Message ---------- */

function addMessage(role, text){

    const box =
    document.createElement("div");


    box.className =
    "message " + role;


    box.innerHTML = `


        <div class="message-avatar">

            <i class="fa-solid ${
                role==="ai"
                ? "fa-robot"
                : "fa-user"
            }"></i>

        </div>



        <div class="message-body">


            <div class="message-header">


                <h4>

                    ${
                    role==="ai"
                    ? "Nova AI"
                    : "You"
                    }

                </h4>



                ${
                role==="ai"
                ?
                `
                <span class="message-time">

                    ${new Date().toLocaleTimeString()}

                </span>
                `
                :
                ""
                }


            </div>



            <p class="ai-text">

                ${text}

            </p>



            ${
            role==="ai"
            ?
            `

            <button class="copy-message">


                <i class="fa-solid fa-copy"></i>

                Copy


            </button>

            `
            :
            ""
            }



        </div>


    `;



    chatWindow.appendChild(box);



    chatWindow.scrollTop =

    chatWindow.scrollHeight;


}

/* ---------- Send ---------- */

async function sendMessage(){
console.log("SEND BUTTON WORKING");
    const text =
    chatInput.value.trim();

    if(!text) return;

    addMessage("user",text);

    chatInput.value="";

    showTyping();

    try{
const me = await fetch(API + "/api/me", {
    credentials: "include"
});

console.log(await me.text());
        const response =
await fetch(
    API + "/api/chat",
            {
                method:"POST",

                credentials:"include",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
    message: text
})
            }
        );

        const result = await response.json();

hideTyping();

if (!result.success) {

    addMessage(
        "ai",
        result.message || "Unknown Error"
    );

    return;

}

addMessage(
    "ai",
    result.reply
);

saveChat();

       

    }

    catch(err){

        hideTyping();

        console.error(err);

        addMessage(
            "ai",
            "❌ "+err.message
        );

    }

}
/* ==========================================
   Nova AI
   Part 2
========================================== */

/* ---------- Save Chat ---------- */

function saveChat(){

    localStorage.setItem(

        CHAT_STORAGE_KEY,

        chatWindow.innerHTML

    );

}

/* ---------- Load Chat ---------- */

function loadChat(){

    const saved =

    localStorage.getItem(

        CHAT_STORAGE_KEY

    );

    if(saved){

        chatWindow.innerHTML =

        saved;

        chatWindow.scrollTop =

        chatWindow.scrollHeight;

    }

}

/* ---------- Typing ---------- */

function showTyping(){

    const box =

    document.createElement("div");

    box.id = "typingIndicator";

    box.className = "message ai";

    box.innerHTML = `

        <div class="message-avatar">

            <i class="fa-solid fa-robot"></i>

        </div>

        <div class="message-body">

            <h4>Nova AI</h4>

            <p>Typing...</p>

        </div>

    `;

    chatWindow.appendChild(box);

    chatWindow.scrollTop =

    chatWindow.scrollHeight;

}

function hideTyping(){

    const typing =

    document.getElementById(

        "typingIndicator"

    );

    if(typing){

        typing.remove();

    }

}

/* ---------- Clear Chat ---------- */

if(clearChatButton){

    clearChatButton.addEventListener(

        "click",

        function(){

            localStorage.removeItem(

                CHAT_STORAGE_KEY

            );

            chatWindow.innerHTML = "";

        }

    );

}
/* ==========================================
   Nova AI
   Part 3
========================================== */

/* ---------- Send Button ---------- */

if(sendMessageButton){

    sendMessageButton.addEventListener(

        "click",

        sendMessage

    );

}

/* ---------- Enter Key ---------- */

if(chatInput){

    chatInput.addEventListener(

        "keydown",

        function(event){

            if(

                event.key === "Enter" &&

                !event.shiftKey

            ){

                event.preventDefault();

                sendMessage();

            }

        }

    );

}

/* ---------- Copy AI Message ---------- */

chatWindow.addEventListener(

    "click",

    function(event){

        const button =

        event.target.closest(

            ".copy-message"

        );

        if(!button) return;

        const text =

        button.parentElement

        .querySelector("p")

        .innerText;

        navigator.clipboard

        .writeText(text);

        button.innerHTML =

        '<i class="fa-solid fa-check"></i> Copied';

        setTimeout(function(){

            button.innerHTML =

            '<i class="fa-regular fa-copy"></i> Copy';

        },1500);

    }

);

/* ---------- Initialize ---------- */

loadChat();

console.log("Nova AI Ready ✅");
