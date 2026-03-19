const canvas = document.getElementById('petCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = 'rgba(255, 250, 255, 0.1)';

const pet = new Pet(canvas);
const STATE_VERSION = 1;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  pet.canvas = canvas;
  pet.ctx = canvas.getContext('2d');
});

let statusTimeout = null;
let isDragging = false;
let isMouseInPetArea = false;

function setWindowIgnoreMouse(ignore) {
  if (window.electronAPI && window.electronAPI.setIgnoreMouse) {
    window.electronAPI.setIgnoreMouse(ignore);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.code === 'Space') {
    e.preventDefault();
    const frozen = pet.toggleFreeze();
    pet.showStatus = true;
    if (statusTimeout) clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
      pet.showStatus = false;
    }, 2000);
  }
});

canvas.addEventListener('mouseenter', () => {
  isMouseInPetArea = true;
  setWindowIgnoreMouse(false);
});

canvas.addEventListener('mouseleave', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const distance = Math.sqrt(
    Math.pow(x - (pet.x + pet.moveX), 2) + 
    Math.pow(y - (pet.y + pet.moveY), 2)
  );
  
  if (distance >= pet.size + 20) {
    isMouseInPetArea = false;
    isDragging = false;
    setWindowIgnoreMouse(true);
    canvas.style.cursor = 'default';
  }
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const petCenterX = pet.x + pet.moveX;
  const petCenterY = pet.y + pet.moveY;
  const distance = Math.sqrt(
    Math.pow(x - petCenterX, 2) + 
    Math.pow(y - petCenterY, 2)
  );
  
  if (distance >= pet.size + 20) {
    isMouseInPetArea = false;
    setWindowIgnoreMouse(true);
    canvas.style.cursor = 'default';
    return;
  }
  
  isMouseInPetArea = true;
  setWindowIgnoreMouse(false);
  
  if (isDragging) {
    pet.x = x - pet.moveX;
    pet.y = y - pet.moveY;
    canvas.style.cursor = 'grabbing';
  } else {
    canvas.style.cursor = distance < pet.size + 20 ? 'pointer' : 'default';
  }
});

canvas.addEventListener('mousedown', (e) => {
  if (!isMouseInPetArea || pet.isFrozen) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const petCenterX = pet.x + pet.moveX;
  const petCenterY = pet.y + pet.moveY;
  const distance = Math.sqrt(
    Math.pow(x - petCenterX, 2) + 
    Math.pow(y - petCenterY, 2)
  );
  
  if (distance < pet.size + 20) {
    isDragging = true;
    canvas.style.cursor = 'grabbing';
  }
});

canvas.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    canvas.style.cursor = 'default';
  }
});

canvas.addEventListener('click', (e) => {
  if (!isMouseInPetArea || isDragging) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const petCenterX = pet.x + pet.moveX;
  const petCenterY = pet.y + pet.moveY;
  const distance = Math.sqrt(
    Math.pow(x - petCenterX, 2) + 
    Math.pow(y - petCenterY, 2)
  );
  
  if (distance < pet.size + 20) {
    if (e.shiftKey) {
      pet.feed();
    } else if (e.altKey) {
      pet.toggleSleep();
    } else {
      pet.pet();
    }
    
    pet.showStatus = true;
    
    if (statusTimeout) clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
      pet.showStatus = false;
    }, 4000);
  }
});

setWindowIgnoreMouse(true);

function gameLoop() {
  pet.update();
  pet.render();
  requestAnimationFrame(gameLoop);
}

function saveState() {
  const state = {
    version: STATE_VERSION,
    x: pet.x,
    y: pet.y,
    hunger: pet.hunger,
    mood: pet.mood,
    state: pet.state,
    animationFrame: pet.animationFrame,
    isFrozen: pet.isFrozen,
    lastSaveTime: Date.now()
  };
  localStorage.setItem('petState', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('petState');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      pet.x = state.x ?? pet.x;
      pet.y = state.y ?? pet.y;
      pet.hunger = state.hunger ?? pet.hunger;
      pet.mood = state.mood ?? pet.mood;
      pet.state = state.state ?? pet.state;
      pet.animationFrame = state.animationFrame ?? pet.animationFrame;
      pet.isFrozen = state.isFrozen ?? false;

      if (state.lastSaveTime) {
        const elapsedSeconds = (Date.now() - state.lastSaveTime) / 1000;
        pet.hunger = Math.max(0, pet.hunger - elapsedSeconds * 0.003);
        if (pet.hunger < 30) {
          pet.mood = Math.max(0, pet.mood - elapsedSeconds * 0.008);
        }
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }
}

loadState();

const saveInterval = setInterval(saveState, 30000);

window.electronAPI.onSaveState(() => {
  saveState();
});

window.addEventListener('beforeunload', saveState);

gameLoop();
