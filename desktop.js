const path = require("path");
const isDev = process.env.NODE_ENV === "development";

let { app, BrowserWindow } = require(path.join(__dirname, "node_modules/.pnpm/electron@41.1.1/node_modules/electron"));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  const url = isDev
    ? "http://localhost:3000/"
    : `file://${path.join(__dirname, "/artifacts/kinetic-souls/dist/public/index.html")}`;

  mainWindow.loadURL(url);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

