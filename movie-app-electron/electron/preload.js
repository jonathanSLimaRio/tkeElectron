const { contextBridge, shell } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openWikipedia: (url) => {
    console.log("🔗 Opening Wikipedia:", url);
    shell.openExternal(url);
  },
});
