const canvas = document.getElementById('petCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log('Canvas size:', canvas.width, canvas.height);

const pet = new Pet(canvas);
console.log('Pet created:', pet);

function gameLoop() {
  pet.update();
  pet.render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
