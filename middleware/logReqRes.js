const fs = require('fs');

function logReqRes(fileName) {
    return (req, _, next) => {
        fs.appendFile(
            fileName,
            `${Date.now()}:${req.ip} ${req.method} ${req.path}\n`,
            ()=>{
                next();
            }
        )
    }
}

module.exports = logReqRes;