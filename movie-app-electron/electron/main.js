const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  console.log("🔧 Criando janela Electron");

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  const htmlPath = path.resolve(
    __dirname,
    "../dist/movie-app-electron/browser/index.html"
  );
  console.log("🧩 Carregando:", htmlPath);

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
