const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


const path = require('path')
const url = require('url')
const http = require('http')

const width = 500;
const height = 300;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
var showing = true;
var result = null;

function createWindow () {

  var xOffset = electron.screen.getPrimaryDisplay().size.width / 4;
  var yOffset = electron.screen.getPrimaryDisplay().size.height / 2 - height / 2;
  // Create the browser window.

  var config = {
    width, height, frame: false, title: "progFinder", center:  true, x: xOffset, y: yOffset, show: showing
  }
  mainWindow = new BrowserWindow(config);
  mainWindow.height = height;
  
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  
  http.createServer(function (req, res) {
      if (showing)     
        mainWindow.hide();
      else
        mainWindow.show();
      
      showing = !showing;

      res.writeHead(200, {'Content-Type': 'text/plain'});     
      result = res;
    
  }).listen(3001);
}

electron.ipcMain.on('on-command', (e,a) => {
    if (result != null)
      result.end("blablabla");

    kill();
});

electron.ipcMain.on('kill', (e,a) => {
  kill();

  if (result != null)
    result.end("");
});

function kill() {
  showing = false;
   mainWindow.hide();
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
