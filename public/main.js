const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  Menu,
} = require("electron");
const os = require("os");
const path = require("path");
const fs = require("fs");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegStatic);

let mainWindow;

//Temporarily storing webm file and then
//Converting webm file to mp4 using ffmpeg

const convertToMp4 = async (chunks) => {
  const pathEl = path.join(os.homedir(), "Desktop");
  const filePath = pathEl.split("\\").join("/");

  const date = new Date();
  const fileName =
    date.getFullYear() +
    "-" +
    date.getMonth() +
    "-" +
    date.getDate() +
    "-" +
    date.getHours() +
    "-" +
    date.getMinutes() +
    "-" +
    date.getSeconds();

  const tempFilePath = filePath + `/temp.webm`;
  const buffer = Buffer.from(chunks);

  const inputFilePath = tempFilePath;
  const outputFilePath = filePath + `/${fileName}.mp4`;
  fs.writeFileSync(tempFilePath, buffer);

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputFilePath)
      .output(outputFilePath)
      .outputOptions("-r 30")

      //Configurations for higher video quality and size

      .videoBitrate("2000k")
      // .size("1092x614")
      // .addOption("-preset", "slow")
      .on("end", () => {
        console.log("Conversion finished");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error: ", err);
        reject(err);
      })
      .run();
  });

  fs.unlinkSync(tempFilePath);

  return outputFilePath;
};

const getDesktopSources = () =>
  desktopCapturer.getSources({ types: ["screen", "window"] });

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 850,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      audio: true,
      preload: path.join(__dirname, "preload.js"),
    },
    resizable: false,
    icon: path.join(__dirname, "icons", "biggerlogo.png"),
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadURL(`file://${__dirname}/../build/index.html`);
  // mainWindow.loadURL("http://localhost:3000");
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("get-sources", async () => {
    try {
      console.log(`Path one: file://${__dirname}/../build/index.html`);
      console.log(path.join(__dirname, "build", "index.html"));

      const sources = await getDesktopSources();
      return sources;
    } catch (error) {
      console.error("Error retrieving desktop sources", error);
      return [];
    }
  });

  ipcMain.handle("conversion", async (event, chunks) => {
    const res = await convertToMp4(chunks);
    return res;
  });

  app.on("active", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () =>
  process.platform !== "darwin" ? app.quit() : ""
);

app.on("active", () =>
  BrowserWindow.getAllWindows().length === 0 ? createWindow() : ""
);
