const fs = require('fs');
const { app, BrowserWindow, ipcMain } = require('electron');

const log = (msg) => {
  fs.appendFileSync('/tmp/e_pet.log', new Date().toISOString() + ' ' + msg + '\n');
};

log('[main] entry point loaded');

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow = null;

function createWindow() {
  log('[main] createWindow start');
  
  mainWindow = new BrowserWindow({
    width: 200,
    height: 250,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  log('[main] loadFile initiated');

  mainWindow.once('ready-to-show', () => {
    log('[main] window ready-to-show and shown');
    mainWindow.show();
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDesc) => {
    log('[main] failed to load: ' + errorCode + ' ' + errorDesc);
  });

  mainWindow.webContents.on('crashed', () => {
    log('[main] renderer crashed');
  });

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'd' && input.type === 'keyDown') {
      mainWindow.webContents.toggleDevTools();
    }
  });

  // 不再设置鼠标穿透，始终接收鼠标事件
  // mainWindow.setIgnoreMouseEvents(true, { forward: true });
  mainWindow.setAlwaysOnTop(true, 'floating', 1);
  
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    log('[console ' + level + '] ' + message + ' (' + sourceId + ':' + line + ')');
  });
  
  log('[main] window created');

  mainWindow.on('closed', () => {
    try {
      require('electron').session.defaultSession.cookies.clear();
    } catch(e) {}
  });
}

ipcMain.on('set-ignore-mouse-events', (event, ignore) => {
  log('[main] set-ignore-mouse-events ' + ignore + ' (received from renderer)');
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(ignore, { forward: true });
    log('[main] setIgnoreMouseEvents called with ' + ignore);
  }
});

ipcMain.on('move-window', (event, deltaX, deltaY) => {
  if (mainWindow) {
    const [x, y] = mainWindow.getPosition();
    mainWindow.setPosition(x + deltaX, y + deltaY);
    log('[main] moved window to ' + (x + deltaX) + ',' + (y + deltaY));
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});