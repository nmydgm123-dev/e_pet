class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 30;
    this.hunger = 100;
    this.mood = 100;
    this.state = 'walking';
    this.direction = 1;
    this.speed = 1;
    this.animationFrame = 0;
  }

  update() {
    this.animationFrame++;
    
    if (this.state === 'walking') {
      this.x += this.speed * this.direction;
      
      if (this.x > this.canvas.width - this.size || this.x < this.size) {
        this.direction *= -1;
      }
      
      this.hunger -= 0.01;
      if (this.hunger < 0) this.hunger = 0;
      
      // 随机进入睡眠
      if (Math.random() < 0.001) {
        this.state = 'sleeping';
      }
    } else if (this.state === 'sleeping') {
      // 随机醒来
      if (Math.random() < 0.005) {
        this.state = 'walking';
      }
    }
    
    if (this.hunger < 30) {
      this.mood -= 0.02;
      if (this.mood < 0) this.mood = 0;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制宠物身体
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();

    // 绘制眼睛
    this.ctx.fillStyle = '#000';
    const eyeOffset = this.direction === 1 ? 5 : -5;
    this.ctx.beginPath();
    this.ctx.arc(this.x - 8 + eyeOffset, this.y - 5, 3, 0, Math.PI * 2);
    this.ctx.arc(this.x + 8 + eyeOffset, this.y - 5, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // 眨眼动画
    if (this.animationFrame % 120 < 10) {
      this.ctx.fillStyle = '#FFB6C1';
      this.ctx.fillRect(this.x - 12 + eyeOffset, this.y - 8, 10, 6);
      this.ctx.fillRect(this.x + 2 + eyeOffset, this.y - 8, 10, 6);
    }

    // 绘制嘴巴
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.x + eyeOffset, this.y + 5, 5, 0, Math.PI);
    this.ctx.stroke();

    if (this.state === 'sleeping') {
      this.ctx.fillStyle = '#000';
      this.ctx.font = '20px Arial';
      this.ctx.fillText('Z', this.x + 20, this.y - 20);
      
      if (this.animationFrame % 60 < 30) {
        this.ctx.fillText('z', this.x + 30, this.y - 30);
      }
    }

    // 状态显示
    this.ctx.fillStyle = '#000';
    this.ctx.font = '12px Arial';
    this.ctx.fillText(`饥饿: ${Math.round(this.hunger)}`, 10, 20);
    this.ctx.fillText(`心情: ${Math.round(this.mood)}`, 10, 35);
  }

  feed() {
    this.hunger = Math.min(100, this.hunger + 20);
    this.mood = Math.min(100, this.mood + 10);
  }

  pet() {
    this.mood = Math.min(100, this.mood + 15);
  }
}

module.exports = Pet;
