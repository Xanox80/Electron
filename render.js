const { ipcRenderer } = require("electron");
const si = require("systeminformation");
const os = require("os");

const cpuName = document.getElementById("cpu-name");
const cpuCores = document.getElementById("cores");
const frequency = document.getElementById("frequency");
const memoryUsageDisplay = document.getElementById("memory");
const gpuName = document.getElementById("gpu-info");
// const gpu = os.
const cpus = os.cpus();

frequency.innerText = `Frequency ${cpus[0].speed}`;
cpuName.innerText = `CPU: ${cpus[0].model}`;
cpuCores.innerText = `Cores Available:  ${cpus.length}`;

function updateMemoryUsage(memoryUsage) {
  memoryUsageDisplay.innerText = `Memory Usage: Heap Used - ${
    memoryUsage.heapUsed / (1024 * 1024)
  } MB, Heap Total - ${memoryUsage.heapTotal / (1024 * 1024)} MB`;
}

setInterval(() => {
  const usedMemory = process.memoryUsage();

  const timestamp = Date.now();

  ipcRenderer.send("update-memory-usage", { usedMemory, timestamp });

  updateMemoryUsage(usedMemory);
}, 1000);

ipcRenderer.on("update-memory-usage", (event, memoryInfo) => {
  updateMemoryUsage(memoryInfo.usedMemory);
});

const gpuInfoDisplay = document.getElementById("gpu-info");

function updateGPUInfo() {
  si.graphics()
    .then((data) => {
      const gpuDetails = data.controllers.map((gpu, index) => {
        return `GPU ${index + 1}: ${gpu.model}, Memory: ${gpu.vram} MB`;
      });

      gpuInfoDisplay.innerText = gpuDetails.join("\n");
    })
    .catch((error) => {
      console.error("Error getting GPU information:", error);
    });
}

// Оновлюйте інформацію про відеокарти кожні 5 секунд
setInterval(updateGPUInfo, 5000);

// Викликайте функцію один раз при завантаженні сторінки
updateGPUInfo();
