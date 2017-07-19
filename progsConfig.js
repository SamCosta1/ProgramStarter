
var child_process = require('child_process');

exports.progs = () => {

    for (var command in baseInfo) {
        var prog = baseInfo[command];
        setVersion(command, prog);    
    }

    for (var command in baseInfo) 
        handleSuperType(command,  baseInfo[command]);
    
    console.log(baseInfo);
    return baseInfo;
}

function handleSuperType(command, prog) {
    if (!prog.extends)
        return;

    console.log(command, prog.extends);
    var copy = {};
    var superProg = baseInfo[prog.extends];

    for (var attr in superProg) copy[attr] = superProg[attr];
    for (var attr in prog) copy[attr] = prog[attr]

    baseInfo[command] = copy;
}

function setVersion(command, prog) {
    if (!prog.version_command)
        return;

    child_process.exec(command + prog.version_command , (error, stdout, stderr) => {
        prog.version = stdout.trim();
    });

}

var programTypes = {
    web_browser: {
        default: "google-chrome",
        file_types: [".html"],
        string: "Web Browser",
    },

    text_editor: {
        default: "gedit",
        file_types: [".*"],
        string: "Text Editor"
    },

    ide: {
        default: "code",
        file_types: [".php", ".c", ".cpp", ".java"], // TODO: Make this better
        string: "Integrated Development Enviroment"
    },

    other: {
        string: "Some Cool App"
    }
}

var baseInfo  = {

    "google-chrome": {
        name: "Google Chrome",
        author: "Google Inc",
        type: "Web Browser",
        version_command: ' -version | cut -f3 -d " "'
    },

    "google-chrome-incognito" : {
        name: "Google Chrome Incognito",
        extends: "google-chrome"
    },

    "firefox" : {
        name: "Firefox",
        author: "Mozzilla Foundation",
        type: "Web Browser",        
        version_command: " -version"
    },

    "gedit" : {
        name: "Gedit",
        author: "",
        type: "Text Editor",
        version_command: ' --version | cut -f4 -d " " '
    },

    "code" : { 
        name: "Visual Studio Code",
        author: "Microsoft Corporation",
        version_command: " -version | sed -n 1p"
    }
}

