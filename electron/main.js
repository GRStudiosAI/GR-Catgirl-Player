const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#120018',
    icon: path.join(__dirname, '../public/logos/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // allow local files easily
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // Handle file associations opens
  if (process.platform === 'win32' && process.argv.length >= 2) {
    const filePath = process.argv[1];
    if (filePath && filePath !== '.') {
      mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.webContents.send('open-file', filePath);
      });
    }
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function handleOpenFile(event, filePath) {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    mainWindow.webContents.send('open-file', filePath);
  }
}

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

// App events
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    // Windows file associations handling for established instance
    if (process.platform === 'win32' && commandLine.length >= 2) {
      const filePath = commandLine[commandLine.length - 1];
      if (filePath && filePath !== '.') {
        handleOpenFile(null, filePath);
      }
    }
  });

  app.on('open-file', (event, filePath) => {
    event.preventDefault();
    handleOpenFile(event, filePath);
  });

  app.whenReady().then(() => {
    createWindow();
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });
}
