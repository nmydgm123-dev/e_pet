const canvas = document.getElementById('petCanvas');
canvas.width = 200;
canvas.height = 200;

const pet = new Pet(canvas);
const STATE_VERSION = 1;

canvas.addEventListener('click', (e) => {
  if (pet.state === 'sleeping') return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const distance = Math.sqrt(
    Math.pow(x - pet.x, 2) + Math.pow(y - pet.y, 2)
  );

  if (distance < pet.size) {
    if (e.shiftKey) {
      pet.feed();
    } else {
      pet.pet();
    }
  }
});

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
    direction: pet.direction,
    animationFrame: pet.animationFrame,
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
      pet.direction = state.direction ?? pet.direction;
      pet.animationFrame = state.animationFrame ?? pet.animationFrame;

      if (state.lastSaveTime) {
        const elapsedSeconds = (Date.now() - state.lastSaveTime) / 1000;
        pet.hunger = Math.max(0, pet.hunger - elapsedSeconds * 0.01);
        if (pet.hunger < 30) {
          pet.mood = Math.max(0, pet.mood - elapsedSeconds * 0.02);
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
