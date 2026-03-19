const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onSaveState: (callback) => ipcRenderer.on('save-state', callback),
  setIgnoreMouse: (ignore) => ipcRenderer.send('set-ignore-mouse', ignore)
});
