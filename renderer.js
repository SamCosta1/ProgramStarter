// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const $ = require("jquery");
const loader = require("./loader");
const filterer = require("./filterer");

var progsList = [];

var elements = {
    $search_box: $('#searchBox')
}

loader.load(onDataRecieved);
function onDataRecieved(data) {
    progsList = data;
}

function onProgChosen() {
    // Do something
    console.log("Enter Pressed");
}

function updateSearchList(searchTerm) {
    var filteredList = filterer.filter(searchTerm, progsList);
    console.log(filteredList);
}

function clickDown() {

}

console.log(elements.$search_box);
elements.$search_box.keyup((e) => {
    if (e.key == "Enter")
        onProgChosen();
    else if (e.key == "ArrowDown")
        clickDown();
    else
        updateSearchList(elements.$search_box.val());
});
