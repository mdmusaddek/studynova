const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");


const usersFile = path.join(
    __dirname,
    "../database/users.json"
);



function loadUsers(){

    if(!fs.existsSync(usersFile)){

        fs.writeFileSync(
            usersFile,
            "[]"
        );

    }

    return JSON.parse(
        fs.readFileSync(usersFile)
    );

}



function saveUsers(users){

    fs.writeFileSync(
        usersFile,
        JSON.stringify(users,null,2)
    );

}



async function register(
    name,
    email,
    password
){

    const users = loadUsers();


    const exists = users.find(
        u => u.email === email
    );


    if(exists){

        throw new Error(
            "Email already exists"
        );

    }



    const hash =
    await bcrypt.hash(
        password,
        10
    );



    const newUser = {

        id: Date.now(),

        name,

        email,

        password_hash: hash,

        created_at:
        new Date().toISOString(),

        is_admin: users.length === 0

    };



    users.push(newUser);


    saveUsers(users);


    return newUser;

}


module.exports = register;