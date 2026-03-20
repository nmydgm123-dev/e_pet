class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 60;
    this.hunger = 100;
    this.mood = 100;
    this.state = 'idle';
    this.animationFrame = 0;
    this.showStatus = false;
  }

  update() {
    this.animationFrame++;
  }

  render() {
    this.ctx.fillStyle = '#FFF0F5';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    const size = 60;
    
    // 大圆头
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 耳朵
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.moveTo(x - 50, y - 40);
    this.ctx.lineTo(x - 30, y - 90);
    this.ctx.lineTo(x - 10, y - 45);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + 50, y - 40);
    this.ctx.lineTo(x + 30, y - 90);
    this.ctx.lineTo(x + 10, y - 45);
    this.ctx.fill();
    
    // 粉色耳朵内部
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.moveTo(x - 42, y - 45);
    this.ctx.lineTo(x - 32, y - 75);
    this.ctx.lineTo(x - 18, y - 48);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + 42, y - 45);
    this.ctx.lineTo(x + 32, y - 75);
    this.ctx.lineTo(x + 18, y - 48);
    this.ctx.fill();
    
    // 粉色眼睛
    this.ctx.fillStyle = '#FF9999';
    this.ctx.beginPath();
    this.ctx.arc(x - 20, y - 10, 12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x + 20, y - 10, 12, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 眼睛高光
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x - 23, y - 14, 5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x + 17, y - 14, 5, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 腮红
    this.ctx.fillStyle = 'rgba(255, 150, 180, 0.5)';
    this.ctx.beginPath();
    this.ctx.arc(x - 40, y + 5, 10, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x + 40, y + 5, 10, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 粉色鼻子
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + 10);
    this.ctx.lineTo(x - 8, y + 20);
    this.ctx.lineTo(x + 8, y + 20);
    this.ctx.fill();
    
    // 粉色嘴巴
    this.ctx.strokeStyle = '#FFCCCC';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(x, y + 25, 15, 0.1 * Math.PI, 0.9 * Math.PI);
    this.ctx.stroke();
    
    // 粉色胡须
    this.ctx.strokeStyle = '#FFD0D0';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(x - 15, y + 15);
    this.ctx.lineTo(x - 60, y + 10);
    this.ctx.moveTo(x - 15, y + 20);
    this.ctx.lineTo(x - 60, y + 22);
    this.ctx.moveTo(x + 15, y + 15);
    this.ctx.lineTo(x + 60, y + 10);
    this.ctx.moveTo(x + 15, y + 20);
    this.ctx.lineTo(x + 60, y + 22);
    this.ctx.stroke();
  }

  feed() {
    this.hunger = Math.min(100, this.hunger + 30);
  }

  pet() {
    this.mood = Math.min(100, this.mood + 25);
  }
}

window.Pet = Pet;
