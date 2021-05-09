const ROLES_FILE = __dirname + '/roles.txt';
const fs = require('fs');

function checkIsValidUser (details, currentAction, role){

    let flag = false;

    for(let i =0; i < details.length; i++){

        let d = details[i];
        if(role == d.role){
            const access = d.scopes.tasks;
            if(access.includes(currentAction)){
                flag =  true;
                break;
            }
        }
    }

    return flag;
}


module.exports = (scope) => (req, res, next) => {

    const role = req.header("x-role");

    if(role){
        const [currentScope, currentAction] = scope.trim().split(".");

        fs.readFile(ROLES_FILE, 'utf8' , (err, data) => {

            if(err){
                res.sendStatus(403)
            }

            let d = data.trim();
            d = d.substring(1, d.length-1)
            d = d.split("},")

            for (let i = 0; i< d.length-1; i++){
                d[i] += "}"
            }

            let array = [];

            d.map(d => {
                array.push(JSON.parse(d))
            })

            let isValidUser = checkIsValidUser(array, currentAction, role)

            if(isValidUser){
                next()
            }else {
                res.sendStatus(403)
            }

        })

    }else {
        res.sendStatus(403)
    }

};
