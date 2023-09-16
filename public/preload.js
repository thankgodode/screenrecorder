const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getScreenSources: () => ipcRenderer.invoke("get-sources"),
  convert: async (blob) => ipcRenderer.invoke("conversion", blob),
});
