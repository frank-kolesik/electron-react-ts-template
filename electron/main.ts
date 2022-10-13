import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

let appWindow: BrowserWindow;

const createWindow = () => {
  appWindow = new BrowserWindow({
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    width: 1280,
  });

  appWindow.setMenu(null);

  appWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../react/index.html')}`
  );

  if (isDev) {
    appWindow.webContents.openDevTools({ mode: 'detach' });
  }
};

const initApp = () => {
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('second-instance', () => {
    if (appWindow) {
      if (appWindow.isMinimized()) appWindow.restore();
      appWindow.focus();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.whenReady().then(createWindow);
};

if (app.requestSingleInstanceLock()) initApp();
else app.quit();
