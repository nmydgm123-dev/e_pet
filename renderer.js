const Pet = require('./pet');

const canvas = document.getElementById('petCanvas');
canvas.width = 200;
canvas.height = 200;

const pet = new Pet(canvas);

function gameLoop() {
  pet.update();
  pet.render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
