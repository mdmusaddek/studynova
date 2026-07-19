const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// ----------------------------
// Database File
// ----------------------------

const USERS_FILE = path.join(__dirname, "users.json");

// ----------------------------
// Create users.json
// ----------------------------

if (!fs.existsSync(USERS_FILE)) {

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify([], null, 2)
    );

}

// ----------------------------
// Load Users
// ----------------------------

function loadUsers() {

    try {

        const data = fs.readFileSync(
            USERS_FILE,
            "utf8"
        );

        return JSON.parse(data);

    } catch (err) {

        return [];

    }

}

// ----------------------------
// Save Users
// ----------------------------

function saveUsers(users) {

    fs.writeFileSync(

        USERS_FILE,

        JSON.stringify(
            users,
            null,
            2
        )

    );

}

// ----------------------------
// Email Validation
// ----------------------------

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

// ----------------------------
// Find User By Email
// ----------------------------

function findUser(email) {

    const users = loadUsers();

    return users.find(

        user =>

        user.email.toLowerCase() ===
        email.toLowerCase()

    );

}
// ----------------------------
// Register User
// ----------------------------

async function register(name, email, password) {

    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();
    password = (password || "").trim();

    if (!name)
        throw new Error("Name is required.");

    if (!email)
        throw new Error("Email is required.");

    if (!password)
        throw new Error("Password is required.");

    if (!isValidEmail(email))
        throw new Error("Invalid email address.");

    const users = loadUsers();

    if (findUser(email))
        throw new Error("Email already exists.");

    const password_hash =
        await bcrypt.hash(password, 10);

    const user = {

        id: Date.now(),

        name,

        email,

        password_hash,

        created_at:
            new Date().toISOString(),

        last_login: null,

        is_admin:
            users.length === 0,
memory: []
    };

    users.push(user);

    saveUsers(users);

   return {

    id: user.id,

    name: user.name,

    email: user.email,

    is_admin: user.is_admin,

    memory: user.memory

};

}

// ----------------------------
// Login User
// ----------------------------

async function login(email, password) {

    email = (email || "").trim().toLowerCase();
    password = (password || "").trim();

    if (!email)
        throw new Error("Email is required.");

    if (!password)
        throw new Error("Password is required.");

    const users = loadUsers();

    const user = users.find(

        u => u.email === email

    );

    if (!user)
        throw new Error("User not found.");

    const ok = await bcrypt.compare(

        password,

        user.password_hash

    );

    if (!ok)
        throw new Error("Wrong password.");

    user.last_login =
        new Date().toISOString();

    saveUsers(users);

   return {

    id: user.id,

    name: user.name,

    email: user.email,

    is_admin: user.is_admin,

    memory: user.memory

};

}
// ----------------------------
// Module Exports
// ----------------------------

module.exports = {

    // Database
    loadUsers,
    saveUsers,

    // Helpers
    findUser,

    // Authentication
    register,
    login

};