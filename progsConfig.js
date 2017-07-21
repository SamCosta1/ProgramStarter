
var child_process = require('child_process');

exports.progs = () => {

    for (var command in baseInfo) {
        var prog = baseInfo[command];
        setVersion(command, prog);    
    }

    for (var command in baseInfo) 
        handleSuperType(command,  baseInfo[command]);
    
    console.log(baseInfo);
    addImageData();
    return baseInfo;
}

function addImageData() {
    child_process.exec("ls pics" , (error, stdout, stderr) => {
        baseInfo.images = stdout.split('\n');
    });
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

var types = {
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

    photo_editor: {
        default: "gimp",
        string: "Image manipulation software"
    },

    other: {
        string: "Some Cool App"
    }
}

var baseInfo  = {

    "google-chrome": {
        name: "Google Chrome",
        author: "Google Inc",
        type: types.web_browser,
        version_command: ' -version | cut -f3 -d " "'
    },

    "google-chrome-incognito" : {
        name: "Google Chrome Incognito",
        extends: "google-chrome"
    },

    "firefox" : {
        name: "Firefox",
        author: "Mozilla Foundation",
        type: types.web_browser,        
        version_command: " -version"
    },

    "gedit" : {
        name: "Gedit",
        author: "",
        type: types.text_editor,
        version_command: ' --version | cut -f4 -d " " '
    },

    "code" : { 
        name: "Visual Studio Code",
        author: "Microsoft Corporation",
        type: types.ide,
        version_command: " -version | sed -n 1p"
    },

    "eclipse": {
        name: "Eclipse neon",
        author: "",
        type: types.ide
    },

    "intellij": {
        name: "IntelliJ IDEA",
        author: "Jet Brains",
        type: types.ide
    },

    "android-studio": {
        name: "Android Studio",
        author: "Google Inc",
        type: types.ide
    },

    "atom": {
        name: "Atom",
        author: "Github",
        type: types.ide,
        version_command: ' -v | sed -n 1p | cut -f6 -d " "'
    },

    "gitkraken": {
        name: "GitKraken",
        author: "Axosoft",
        type: types.other,
        version_command: "  --version | sed -n 2p "
    },

    "gimp": {
        name: "Gimp",
        type: types.photo_editor,
        version_command: ' --version | cut -f6 -d " "'
    }
}

