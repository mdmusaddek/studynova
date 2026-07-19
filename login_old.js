const API = "http://127.0.0.1:3000";

let isLogin = false;

const nameBox = document.getElementById("name");
const registerFields = document.getElementById("registerFields");

const emailBox = document.getElementById("email");
const passwordBox = document.getElementById("password");

const button = document.getElementById("mainButton");
const toggle = document.getElementById("toggleMode");
const statusText = document.getElementById("status");

const guestBtn = document.getElementById("guestBtn");


// ----------------------------
// Switch Login / Register
// ----------------------------

toggle.onclick = () => {

    isLogin = !isLogin;

    if (isLogin) {

        registerFields.style.display = "none";

        button.innerText = "Login";

        toggle.innerText = "Create Account";

        document.querySelector(".switch").firstChild.textContent =
            "Don't have an account? ";

    } else {

        registerFields.style.display = "block";

        button.innerText = "Create Account";

        toggle.innerText = "Login";

        document.querySelector(".switch").firstChild.textContent =
            "Already have an account? ";

    }

};


// ----------------------------
// Login / Register
// ----------------------------

button.onclick = async () => {

    statusText.style.color = "#ffffff";
    statusText.innerText = "Please wait...";

    const email = emailBox.value.trim();
    const password = passwordBox.value.trim();

    if (!email || !password) {

        statusText.style.color = "#ff7b7b";
        statusText.innerText = "Please fill all required fields.";

        return;

    }

    try {

        // =========================
        // LOGIN
        // =========================

        if (isLogin) {

            const response = await fetch(`${API}/api/login`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                credentials: "include",

                body: JSON.stringify({

                    email,
                    password

                })

            });

            const result = await response.json();

            if (!result.success) {

                statusText.style.color = "#ff7b7b";
                statusText.innerText = result.message;

                return;

            }

            localStorage.setItem(

                "nova_user",

                JSON.stringify(result.user)

            );

            statusText.style.color = "#72ff9d";
            statusText.innerText = "Login successful.";

            setTimeout(() => {

                window.location.href =
                    "http://127.0.0.1:3000/NovaOs.html";

            }, 800);

        }

        // =========================
        // REGISTER
        // =========================

        else {

            const name = nameBox.value.trim();

            if (!name) {

                statusText.style.color = "#ff7b7b";
                statusText.innerText = "Please enter your name.";

                return;

            }

            const response = await fetch(`${API}/api/register`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                credentials: "include",

                body: JSON.stringify({

                    name,
                    email,
                    password

                })

            });

            const result = await response.json();

            if (!result.success) {

                statusText.style.color = "#ff7b7b";
                statusText.innerText = result.message;

                return;

            }

            statusText.style.color = "#72ff9d";
            statusText.innerText =
                "Registration successful. Please login.";

            setTimeout(() => {

                toggle.click();

            }, 1200);

        }

    }

    catch (err) {

        console.error(err);

        statusText.style.color = "#ff7b7b";

        statusText.innerText =
            "Cannot connect to NovaOS Backend.";

    }

};


// ----------------------------
// Guest Mode
// ----------------------------

guestBtn.onclick = () => {

    localStorage.setItem(

        "nova_guest",

        "true"

    );

    window.location.href =
        "http://127.0.0.1:3000/NovaOs.html";

};