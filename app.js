/* =====================================================
   NovaOS Lite
   app.js
   Core Application Controller
===================================================== */

// ============================
// User Profile
// ============================

const user =
JSON.parse(
localStorage.getItem("nova_user")
);

const isGuest =
localStorage.getItem("nova_guest") === "true";

const nameElement =
document.getElementById("userName");

const emailElement =
document.getElementById("userEmail");

const roleElement =
document.getElementById("userRole");

const avatarElement =
document.getElementById("userAvatar");

if(isGuest){

nameElement.textContent="Guest";

emailElement.textContent="Guest Mode";

roleElement.textContent="Guest";

avatarElement.textContent="G";

}

else if(user){

nameElement.textContent=user.name;

emailElement.textContent=user.email;

avatarElement.textContent=
user.name.charAt(0).toUpperCase();

if(user.is_admin){

roleElement.textContent="Administrator";

roleElement.style.background="#ff9800";

}

else{

roleElement.textContent="User";

}

}





"use strict";

/* ==========================================
   Elements
========================================== */

const pages = document.querySelectorAll(".page");

const navButtons = document.querySelectorAll(".nav-btn");

const cardButtons = document.querySelectorAll("[data-page]");

const pageTitle = document.getElementById("pageTitle");

const themeButton = document.querySelector(".theme-btn");

/* ==========================================
   Titles
========================================== */

const pageTitles = {

    dashboard: "Dashboard",

    notes: "Notes",

    gpa: "GPA Calculator",

    cgpa: "CGPA Calculator",

    chat: "AI Chat",

    pdf: "PDF Summary"

};

/* ==========================================
   Open Page
========================================== */

function openPage(pageId){

    pages.forEach(page=>{

        page.classList.remove("active");

    });

    const target=document.getElementById(pageId);

    if(target){

        target.classList.add("active");

    }

    navButtons.forEach(btn=>{

        btn.classList.remove("active");

        if(btn.dataset.page===pageId){

            btn.classList.add("active");

        }

    });

    if(pageTitle){

        pageTitle.textContent=

        pageTitles[pageId] ||

        "NovaOS Lite";

    }

}

/* ==========================================
   Navigation
========================================== */

cardButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const page=

        button.dataset.page;

        if(page){

            openPage(page);

        }

    });

});

/* ==========================================
   Theme
========================================== */

function loadTheme(){

    const saved=

    localStorage.getItem("nova-theme");

    if(saved==="light"){

        document.body.classList.add("light");

    }

}

loadTheme();

themeButton?.addEventListener("click",()=>{

    document.body.classList.toggle("light");

    const mode=

    document.body.classList.contains("light")

    ? "light"

    : "dark";

    localStorage.setItem(

        "nova-theme",

        mode

    );

});

/* ==========================================
   Dashboard Numbers
========================================== */

function updateDashboard(){

    const totalNotes=

    JSON.parse(

        localStorage.getItem("nova-notes")

        || "[]"

    ).length;

    document.getElementById(

        "totalNotes"

    ).textContent=

    totalNotes;

}

updateDashboard();

/* ==========================================
   Keyboard Shortcut
========================================== */

document.addEventListener(

"keydown",

(event)=>{

if(event.ctrlKey && event.key==="1"){

openPage("dashboard");

}

if(event.ctrlKey && event.key==="2"){

openPage("notes");

}

if(event.ctrlKey && event.key==="3"){

openPage("gpa");

}

if(event.ctrlKey && event.key==="4"){

openPage("cgpa");

}

if(event.ctrlKey && event.key==="5"){

openPage("chat");

}

if(event.ctrlKey && event.key==="6"){

openPage("pdf");

}

}

/* ==========================================
   Init
========================================== */

);

openPage("dashboard");

window.addEventListener("load",function(){

setTimeout(function(){

document.getElementById("loader").style.opacity="0";

setTimeout(function(){

document.getElementById("loader").style.display="none";

},800);

},1800);

});
function showToast(message, type = "success") {

    const container = document.getElementById("toastContainer");

    if (!container) {
        console.error("toastContainer not found");
        return;
    }

    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}