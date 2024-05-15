const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Needed for Node.js integration in renderer process
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('download-photo', async (event, url) => {
    const win = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Save Image',
        defaultPath: path.join(app.getPath('downloads'), 'photo.jpg'),
        buttonLabel: 'Save',
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
    };
    const { filePath } = await dialog.showSaveDialog(win, options);
    if (filePath) {
        const file = fs.createWriteStream(filePath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('Download completed!');
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            console.error('Error downloading file:', err);
        });
    }
});
