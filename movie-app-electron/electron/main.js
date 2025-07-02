const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  console.log("🔧 Creating window Electron");

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const htmlPath = path.resolve(
    __dirname,
    "../dist/movie-app-electron/browser/index.html"
  );
  console.log("🧩 Loading:", htmlPath);

  win.loadURL(`file://${htmlPath}`);
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
