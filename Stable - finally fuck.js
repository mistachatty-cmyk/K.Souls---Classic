"main": "desktop.js",
"scripts": {
  "start": "node server.js", 
  "app": "electron ."
}
"main": "desktop.js",
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true, // Hides the top menu bar for a clean game look
  });

  // Give the server a couple of seconds to start up before loading the page
  setTimeout(() => {
    win.loadURL('http://localhost:1414');
  }, 2000);
}

app.whenReady().then(() => {
  // Automatically run your local server in the background
  serverProcess = spawn('npm', ['start'], { shell: true });
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Clean up the background server process when the user closes the app window
app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
