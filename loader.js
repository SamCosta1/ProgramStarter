const fs = require("fs");

const listFile = "executables.txt"

exports.load = function(callback) {
     fs.readFile(listFile,  'utf8', (err, data) => {
        if (err) 
            return null;

        callback(data.split("\n"));        
    });
    
}