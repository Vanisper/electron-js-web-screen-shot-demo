import {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  Menu,
  webContents,
} from "electron";
import path from "path";
import { IpcEvents } from "./ipcEvents";

// 忽略Electron的警告
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
app.commandLine.appendSwitch("disable-web-security");
app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors"); // 允许跨域
app.commandLine.appendSwitch("--ignore-certificate-errors", "true"); // 忽略证书相关错误

let win: null | BrowserWindow = null;

const createWindow = async () => {
  // Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    title: "electron js-web-screen-shot demo",
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    // win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  app.exit();
});

// 修复electron18.0.0-beta.5 之后版本的BUG: 无法获取当前程序页面视频流
const selfWindws = async () =>
  await Promise.all(
    webContents
      .getAllWebContents()
      .filter((item) => {
        const win = BrowserWindow.fromWebContents(item);
        return win && win.isVisible();
      })
      .map(async (item) => {
        const win = BrowserWindow.fromWebContents(item);
        const thumbnail = await win?.capturePage();
        // 当程序窗口打开DevTool的时候  也会计入
        return {
          name:
            win?.getTitle() + (item.devToolsWebContents === null ? "" : "-dev"), // 给dev窗口加上后缀
          id: win?.getMediaSourceId(),
          thumbnail,
          display_id: "",
          appIcon: null,
        };
      })
  );

// 获取设备窗口信息
ipcMain.handle(
  IpcEvents.EV_SEND_DESKTOP_CAPTURER_SOURCE,
  async (_event, _args) => {
    return [
      ...(await desktopCapturer.getSources({ types: ["window", "screen"] })),
      ...(await selfWindws()),
    ];
  }
);
