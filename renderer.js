const Pet = require('./pet');

const canvas = document.getElementById('petCanvas');
canvas.width = 200;
canvas.height = 200;

const pet = new Pet(canvas);

canvas.addEventListener('click', (e) => {
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
    x: pet.x,
    hunger: pet.hunger,
    mood: pet.mood,
    state: pet.state
  };
  localStorage.setItem('petState', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('petState');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      pet.x = state.x || pet.x;
      pet.hunger = state.hunger || pet.hunger;
      pet.mood = state.mood || pet.mood;
      pet.state = state.state || pet.state;
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }
}

// 启动时加载状态
loadState();

// 定时保存状态
setInterval(saveState, 30000);

// 关闭前保存
window.addEventListener('beforeunload', saveState);

gameLoop();
