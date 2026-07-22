"use strict";

/* =====================================================
   StudyNova App
   Core Controller
===================================================== */

window.API = "https://studynova-jyrg.onrender.com";

/* ===============================
   Login Check
================================ */

async function checkLogin() {

    const guest =
        localStorage.getItem("nova_guest") === "true";

    if (guest) {
        return true;
    }

    try {

        const response = await fetch(
            API + "/api/me",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!data.success) {

            localStorage.removeItem("nova_user");

            window.location.href = "login.html";

            return false;

        }

        localStorage.setItem(
            "nova_user",
            JSON.stringify(data.user)
        );

        return true;

    }

    catch (err) {

        console.log(err);

        localStorage.removeItem("nova_user");

        window.location.href = "login.html";

        return false;

    }

}

/* ===============================
   App Start
================================ */

startApp();

function startApp() {

const isGuest =
localStorage.getItem("nova_guest") === "true";

const user =
JSON.parse(
localStorage.getItem("nova_user")
);

/* ===============================
   User Profile
================================ */

const nameElement =
document.getElementById("userName");

const emailElement =
document.getElementById("userEmail");

const roleElement =
document.getElementById("userRole");

const avatarElement =
document.getElementById("userAvatar");

if (
nameElement &&
emailElement &&
roleElement &&
avatarElement
){

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

roleElement.textContent=
"Administrator";

roleElement.style.background=
"#ff9800";

}

else{

roleElement.textContent="User";

}

}

}

/* ===============================
   Loader
================================ */

window.addEventListener("load",()=>{

const loader =
document.getElementById("loader");

if(!loader) return;

setTimeout(()=>{

loader.style.opacity="0";

setTimeout(()=>{

loader.style.display="none";

},500);

},1000);

});
/* ===============================
   Elements
================================ */

const pages =
document.querySelectorAll(".page");

const navButtons =
document.querySelectorAll(".nav-btn");

const pageTitle =
document.getElementById("pageTitle");

const themeButton =
document.querySelector(".theme-btn");

const cardButtons =
document.querySelectorAll("[data-page]");

/* ===============================
   Page Titles
================================ */

const pageTitles = {

dashboard:"Dashboard",

notes:"Notes",

gpa:"GPA Calculator",

cgpa:"CGPA Calculator",

chat:"AI Chat",

pdf:"PDF Summary"

};

/* ===============================
   Open Page
================================ */

function openPage(page){

pages.forEach(p=>{

p.classList.remove("active");

});

const target =
document.getElementById(page);

if(target){

target.classList.add("active");

}

navButtons.forEach(btn=>{

btn.classList.remove("active");

if(btn.dataset.page===page){

btn.classList.add("active");

}

});

if(pageTitle){

pageTitle.textContent =
pageTitles[page] || "StudyNova";

}

}

/* ===============================
   Navigation
================================ */

navButtons.forEach(btn=>{

btn.onclick=()=>{

openPage(btn.dataset.page);

};

});

cardButtons.forEach(btn=>{

btn.onclick=()=>{

const page =
btn.dataset.page;

if(page){

openPage(page);

}

};

});

/* ===============================
   Theme
================================ */

const savedTheme =
localStorage.getItem("nova-theme");

if(savedTheme==="light"){

document.body.classList.add("light");

}

themeButton?.addEventListener("click",()=>{

document.body.classList.toggle("light");

localStorage.setItem(

"nova-theme",

document.body.classList.contains("light")

?

"light"

:

"dark"

);

});

/* ===============================
   Dashboard
================================ */

function updateDashboard(){

const notes =

JSON.parse(

localStorage.getItem("nova-notes")

||

"[]"

);

const totalNotes =
document.getElementById("totalNotes");

if(totalNotes){

totalNotes.textContent =
notes.length;

}

}

updateDashboard();

/* ===============================
   Keyboard Shortcut
================================ */

document.addEventListener(

"keydown",

e=>{

if(e.ctrlKey && e.key==="1")

openPage("dashboard");

if(e.ctrlKey && e.key==="2")

openPage("notes");

if(e.ctrlKey && e.key==="3")

openPage("gpa");

if(e.ctrlKey && e.key==="4")

openPage("cgpa");

if(e.ctrlKey && e.key==="5")

openPage("chat");

if(e.ctrlKey && e.key==="6")

openPage("pdf");

}

);

openPage("dashboard");
/* ===============================
   Toast
================================ */

function showToast(message,type="success"){

const container=
document.getElementById("toastContainer");

if(!container)return;

const toast=
document.createElement("div");

toast.className=
"toast "+type;

toast.textContent=
message;

container.appendChild(toast);

setTimeout(()=>{

toast.remove();

},3500);

}

/* ===============================
   App Ready
================================ */

console.log("StudyNova Loaded Successfully");

} // <-- startApp() ends here
