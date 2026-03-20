class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 40;
    this.hunger = 100;
    this.mood = 100;
    this.state = 'idle';
    this.animationFrame = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.isFrozen = false;
    this.showStatus = false;
  }

  update() {
    this.animationFrame++;
    // 简单平滑移动，限制在屏幕左半区
    if (!this.isFrozen) {
      this.moveX += Math.sin(this.animationFrame * 0.04) * 0.6;
      this.moveY += Math.cos(this.animationFrame * 0.03) * 0.3;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 允许在屏幕左半区移动
    const leftLimit = this.size;
    const rightLimit = this.canvas.width / 2 - this.size;
    const displayX = Math.max(leftLimit, Math.min(this.canvas.width / 2 - this.size, (this.x + this.moveX)));
    const displayY = Math.max(this.size, Math.min(this.canvas.height - this.size, (this.y + this.moveY)));

    // 面部颜色/风格：正脸卡通，柔和马卡龙色
    // 面部底色
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.arc(displayX, displayY, this.size, 0, Math.PI * 2);
    this.ctx.fill();

    // 眼睛（柔和、圆圆的）
    this.ctx.fillStyle = '#3b3b3b';
    this.ctx.beginPath();
    this.ctx.arc(displayX - this.size * 0.25, displayY - this.size * 0.25, this.size * 0.18, 0, Math.PI * 2);
    this.ctx.arc(displayX + this.size * 0.25, displayY - this.size * 0.25, this.size * 0.18, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 高光
    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.arc(displayX - this.size * 0.28, displayY - this.size * 0.28, this.size * 0.08, 0, Math.PI * 2);
    this.ctx.arc(displayX + this.size * 0.18, displayY - this.size * 0.28, this.size * 0.08, 0, Math.PI * 2);
    this.ctx.fill();

    // 微笑嘴巴
    this.ctx.strokeStyle = '#c66';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(displayX, displayY + this.size * 0.25, this.size * 0.4, 0.2 * Math.PI, 0.8 * Math.PI);
    this.ctx.stroke();

    // 腮红（淡粉）
    this.ctx.fillStyle = 'rgba(255, 105, 180, 0.25)';
    this.ctx.beginPath();
    this.ctx.arc(displayX - this.size * 0.5, displayY, this.size * 0.28, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(displayX + this.size * 0.5, displayY, this.size * 0.28, 0, Math.PI * 2);
    this.ctx.fill();

    // 状态框（简易，短时显示）
    if (this.showStatus) {
      const boxW = 90, boxH = 50;
      const boxX = displayX + this.size + 10;
      const boxY = Math.max(20, displayY - boxH / 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      this.ctx.strokeStyle = '#FFB6C1';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.roundRect(boxX, boxY, boxW, boxH, 8);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.fillStyle = '#333';
      this.ctx.font = '12px sans-serif';
      this.ctx.fillText('状态', boxX + 8, boxY + 24);
    }
  }

  feed() {
    this.hunger = Math.min(100, this.hunger + 15);
    this.mood = Math.min(100, this.mood + 5);
  }

  pet() {
    this.mood = Math.min(100, this.mood + 20);
    this.showStatus = true;
    if (this._statusTimer) clearTimeout(this._statusTimer);
    this._statusTimer = setTimeout(() => { this.showStatus = false; }, 1500);
  }

  toggleSleep() { /* 只做演示，不强制睡眠状态 */ }
}

window.Pet = Pet;
