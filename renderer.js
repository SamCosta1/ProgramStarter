// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require("jquery");
const loader = require("./loader"); loader.load((data) => {  progsList = data; });

const progsConfig = require("./progsConfig").progs();

const filterer = require("./filterer");
const http = require('http')
const guiMaker = require('./guiMaker')
const electron = require('electron')

var progsList = [];

var elements = {
    $body: $('body'),
    $search_box: $('#searchBox'),
    $result_box: $('.left-container'),
    $logos: $('.logo'),

    $name: $('.name'),
    $version: $('.version'),
    $author: $('.author')
};

$(document).ready(() => {
    var height = electron.remote.getCurrentWindow().height;
    elements.$result_box.height(height - elements.$search_box.outerHeight() - 20);
});

function searchVal() {       return elements.$search_box.val();                             }
function autoCompleteVal() { return elements.$result_box.find(".selected").data("command"); }
function onProgChosen() {    electron.ipcRenderer.send('on-command', autoCompleteVal());    }

electron.ipcRenderer.on("reset", reset);

function reset() {
    elements.$search_box.val("");   
    updateSearchList();
    refresh();
}

function updateSearchList(searchTerm) {
    elements.$result_box.empty();

    if (!searchTerm || searchTerm.trim().length == 0)
        return;

    var filteredList = filterer.filter(searchTerm, progsList);


    for (i in filteredList)
        elements.$result_box.append(guiMaker.newResultField(filteredList[i]));
    elements.$result_box.children().first().addClass('selected');
}

function refresh() {
    var selectedCommand = autoCompleteVal();
    setImages(selectedCommand);
    
    if (progsConfig[selectedCommand])
        setDetails(progsConfig[selectedCommand]);
    else
        setDetails({});
}

function setDetails(info) {
    elements.$name.html("");
    elements.$author.html("");
    elements.$version.html("");

    elements.$name.html(info.name);
    elements.$version.html(info.version);
    elements.$author.html(info.author);
}

function setImages(command) {
    if (progsConfig.images.indexOf(command + ".png") >= 0) {
        elements.$logos.show();
        elements.$logos.attr("src", "pics/" + command + ".png");
    }
    else {
        elements.$logos.hide();
        elements.$logos.attr("src", "");
    }
}

function clickDown() {
    var $selected = elements.$result_box.find('.selected');
    $selected.removeClass('selected');
    
    var $next = $selected.next();
    $next.addClass('selected');
}


function clickUp() {
    var $selected = elements.$result_box.find('.selected');
    $selected.removeClass('selected');
    
    var $previous = $selected.prev();
    $previous.addClass('selected');
}

$(window).keyup((e) => {
    if (e.key == "Enter")
        onProgChosen();
    else if (e.key == "ArrowDown")
        clickDown();    
    else if (e.key == "ArrowUp")
        clickUp();
    else if (e.key == "Escape")
        electron.ipcRenderer.send('kill', 1);
    else
        updateSearchList(searchVal());
    refresh();
});