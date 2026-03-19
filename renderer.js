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

gameLoop();
