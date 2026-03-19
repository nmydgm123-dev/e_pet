class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 50;
  }

  update() {
  }

  render() {
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.arc(this.x - 15, this.y - 5, 8, 0, Math.PI * 2);
    this.ctx.arc(this.x + 15, this.y - 5, 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y + 15, 15, 0.1 * Math.PI, 0.9 * Math.PI);
    this.ctx.stroke();
  }
}

window.Pet = Pet;
