// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require("jquery");
const loader = require("./loader");
const filterer = require("./filterer");
const http = require('http')
const guiMaker = require('./guiMaker')
const electron = require('electron')

var progsList = [];

var elements = {
    $body: $('body'),
    $search_box: $('#searchBox'),
    $result_box: $('.left-container'),
}

loader.load(onDataRecieved);
function onDataRecieved(data) {
    progsList = data;
}

function onProgChosen() {
    // Do something
    console.log("Enter Pressed");
    
    electron.ipcRenderer.send('on-command', 1);
}

function updateSearchList(searchTerm) {
    var filteredList = filterer.filter(searchTerm, progsList);

    elements.$result_box.empty();

    for (i in filteredList)
        elements.$result_box.append(guiMaker.newResultField(filteredList[i]));
    elements.$result_box.children().first().addClass('selected');
}

function clickDown() {
    var $selected = elements.$result_box.find('.selected');
    $selected.removeClass('selected');
    
    var $next = $selected.next();
    $next.addClass('selected');

  //  $next[0].scrollIntoView({block: "end"});
}

function clickUp() {
    var $selected = elements.$result_box.find('.selected');
    $selected.removeClass('selected');
    
    var $previous = $selected.prev();
    $previous.addClass('selected');

  //  $previous[0].scrollIntoView({block: "end"});
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
        updateSearchList(elements.$search_box.val());
});

$(document).ready(() => {

    var height = electron.remote.getCurrentWindow().height;
    elements.$result_box.height(height - elements.$search_box.outerHeight()  - 20);


});