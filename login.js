const API = "http://127.0.0.1:3000";

let isLogin = false;

// ----------------------
// Elements
// ----------------------

const nameBox =
document.getElementById("name");

const registerFields =
document.getElementById("registerFields");

const emailBox =
document.getElementById("email");

const passwordBox =
document.getElementById("password");

const button =
document.getElementById("mainButton");

const toggle =
document.getElementById("toggleMode");

const statusText =
document.getElementById("status");

const guestBtn =
document.getElementById("guestBtn");

// ----------------------
// Toggle Login/Register
// ----------------------

toggle.onclick = () => {

    isLogin = !isLogin;

    if (isLogin) {

        registerFields.style.display =
            "none";

        button.innerText =
            "Login";

        toggle.innerText =
            "Create Account";

        document.querySelector(".switch")
        .firstChild.textContent =
        "Don't have an account? ";

    }

    else {

        registerFields.style.display =
            "block";

        button.innerText =
            "Create Account";

        toggle.innerText =
            "Login";

        document.querySelector(".switch")
        .firstChild.textContent =
        "Already have an account? ";

    }

};
// ----------------------
// Main Button
// ----------------------

button.onclick = async () => {

    statusText.style.color = "#ffffff";
    statusText.innerText = "Please wait...";

    const email = emailBox.value.trim();
    const password = passwordBox.value.trim();

    if (!email || !password) {

        statusText.style.color = "#ff7b7b";
        statusText.innerText = "Email and Password are required.";

        return;

    }

    try {

        // ----------------------
        // LOGIN
        // ----------------------

        if (isLogin) {

            const response = await fetch(
                `${API}/api/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

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
localStorage.removeItem("nova_guest");
            statusText.style.color = "#72ff9d";
            statusText.innerText = "Login successful.";

            setTimeout(() => {

                window.location.href = "index.html";

            }, 700);

        }

        // ----------------------
        // REGISTER
        // ----------------------

        else {

            const name = nameBox.value.trim();

            if (!name) {

                statusText.style.color = "#ff7b7b";
                statusText.innerText = "Enter your name.";

                return;

            }

            const response = await fetch(
                `${API}/api/register`,
                {
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
                }
            );

            const result = await response.json();

            if (!result.success) {

                statusText.style.color = "#ff7b7b";
                statusText.innerText = result.message;

                return;

            }

            statusText.style.color = "#72ff9d";
            statusText.innerText =
                "Registration successful. Please login.";

            toggle.click();

        }

    }

    catch (err) {

        console.error(err);

        statusText.style.color = "#ff7b7b";
        statusText.innerText =
            "Cannot connect to NovaOS Backend.";

    }

};
// ----------------------
// Guest Mode
// ----------------------

guestBtn.onclick = () => {

    localStorage.setItem(
        "nova_guest",
        "true"
    );

    window.location.href = "index.html";

};
// ----------------------
// Auto Login
// ----------------------

window.addEventListener("load", async () => {

    try {

        const response = await fetch(
            `${API}/api/me`,
            {
                credentials: "include"
            }
        );

        const result = await response.json();

        if (result.success) {

            localStorage.setItem(
                "nova_user",
                JSON.stringify(result.user)
            );

            window.location.href = "index.html";

        }

    }

    catch (err) {

        console.log("No active session.");

    }

});

// ----------------------
// Guest Mode
// ----------------------

guestBtn.onclick = () => {

    localStorage.removeItem("nova_user");

    localStorage.setItem(
        "nova_guest",
        "true"
    );

    window.location.href = "index.html";

};
