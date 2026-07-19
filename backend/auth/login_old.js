const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");


const usersFile = path.join(
    __dirname,
    "../database/users.json"
);



function loadUsers(){

    return JSON.parse(
        fs.readFileSync(usersFile)
    );

}



async function login(email, password){


    const users = loadUsers();



    const user = users.find(
        u => u.email === email
    );



    if(!user){

        throw new Error(
            "User not found"
        );

    }



    const match =
    await bcrypt.compare(
        password,
        user.password_hash
    );



    if(!match){

        throw new Error(
            "Wrong password"
        );

    }



    user.last_login =
    new Date().toISOString();



    fs.writeFileSync(
        usersFile,
        JSON.stringify(
            users,
            null,
            2
        )
    );



    return {

        id:user.id,

        name:user.name,

        email:user.email,

        is_admin:user.is_admin

    };


}



module.exports = login;