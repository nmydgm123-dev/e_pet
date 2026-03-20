const canvas = document.getElementById('petCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = '#FFF0F5';

const pet = new Pet(canvas);

function gameLoop() {
  pet.update();
  pet.render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
