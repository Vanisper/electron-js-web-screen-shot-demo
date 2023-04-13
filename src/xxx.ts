export const getDesktopCapturerSource = async () => {
  return await window.electron.ipcRenderer.invoke<
    Electron.DesktopCapturerSource[]
  >("ev:send-desktop-capturer_source", []);
};
