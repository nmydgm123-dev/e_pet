const logFile = '/tmp/e_pet_render.log';
const log = (msg) => {
  try {
    require('fs').appendFileSync(logFile, new Date().toISOString() + ' ' + msg + '\n');
  } catch (e) {}
  console.log(msg);
};

log('[renderer] start');

let ipcRenderer;
try {
  ipcRenderer = require('electron').ipcRenderer;
  log('[renderer] ipcRenderer OK');
} catch (e) {
  log('[renderer] IPC error: ' + e);
}

const canvas = document.getElementById('petCanvas');
log('[renderer] canvas: ' + canvas);
canvas.width = 200;
canvas.height = 250;

const pet = new Pet(canvas);
log('[renderer] pet created, x: ' + pet.x + ', y: ' + pet.y);

const statusPanel = document.getElementById('statusPanel');
const moodValue = document.getElementById('moodValue');
const hungerValue = document.getElementById('hungerValue');
log('[renderer] UI elements ready');

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let lastWindowX = null;
let lastWindowY = null;
let hidePanelTimer = null;
let isBeingDragged = false;

function showPanel() {
  log('[renderer] showPanel');
  const state = pet.getState();
  moodValue.textContent = Math.round(state.mood);
  hungerValue.textContent = Math.round(state.hunger);
  statusPanel.classList.remove('hidden');
  
  if (hidePanelTimer) clearTimeout(hidePanelTimer);
  hidePanelTimer = setTimeout(() => {
    statusPanel.classList.add('hidden');
  }, 3000);
}

function saveState() {
  localStorage.setItem('petState', JSON.stringify(pet.getState()));
}

function loadState() {
  const saved = localStorage.getItem('petState');
  if (saved) {
    try {
      pet.loadState(JSON.parse(saved));
    } catch (e) {
      log('[renderer] loadState error: ' + e);
    }
  }
}

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  if (pet.isPointInside(x, y)) {
    isDragging = true;
    isBeingDragged = true;
    pet.setDragging(true);
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    lastWindowX = null;
    lastWindowY = null;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    if (ipcRenderer) {
      ipcRenderer.send('move-window', deltaX, deltaY);
    }
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (pet.isPointInside(x, y)) {
      if (e.shiftKey) {
        pet.feed();
        pet.showFeedEffect();
      } else {
        pet.pet();
        pet.showPetEffect();
      }
      showPanel();
    }
    isDragging = false;
    isBeingDragged = false;
    pet.setDragging(false);
  }
});

loadState();
setInterval(saveState, 30000);
window.addEventListener('beforeunload', saveState);

let frameCount = 0;
function gameLoop() {
  frameCount++;
  if (frameCount % 60 === 0) {
    log('[renderer] gameLoop frame: ' + frameCount + ', x: ' + pet.x + ', state: ' + pet.state);
  }
  
  pet.update();
  pet.render();
  requestAnimationFrame(gameLoop);
}

log('[renderer] starting gameLoop');
gameLoop();