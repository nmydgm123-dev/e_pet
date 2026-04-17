class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = 100;
    this.y = 125;
    this.bodyRadius = 30;
    this.earHeight = 15;
    this.hunger = 100;
    this.mood = 100;
    this.state = 'walking';
    this.direction = 1;
    this.frame = 0;
    this.blinkTimer = 0;
    this.isBlinking = false;
  }

  update() {
    this.frame++;
    
    // 走动
    if (this.state === 'walking') {
      this.x += 0.5 * this.direction;
      if (this.x > 170) { this.x = 170; this.direction = -1; }
      if (this.x < 30) { this.x = 30; this.direction = 1; }
      
      // 随机进入睡眠
      if (Math.random() < 0.002) {
        this.state = 'sleeping';
      }
    }
    
    // 睡觉
    if (this.state === 'sleeping') {
      if (Math.random() < 0.005) {
        this.state = 'walking';
      }
    }
    
    // 眨眼（每2-4秒一次）
    this.blinkTimer++;
    if (!this.isBlinking && this.blinkTimer > 120 + Math.random() * 120) {
      this.isBlinking = true;
      this.blinkTimer = 0;
    }
    if (this.isBlinking && this.frame % 6 === 0) {
      this.isBlinking = false;
    }
  }

  render() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const d = this.direction;
    const ex = d * 3;
    
    // 身体 - 深粉色
    this.ctx.fillStyle = '#FF1493';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.bodyRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 耳朵
    this.ctx.fillStyle = '#FF1493';
    this.ctx.beginPath();
    this.ctx.moveTo(this.x - 20, this.y - 25);
    this.ctx.lineTo(this.x - 25, this.y - 45);
    this.ctx.lineTo(this.x - 8, this.y - 25);
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + 8, this.y - 25);
    this.ctx.lineTo(this.x + 25, this.y - 45);
    this.ctx.lineTo(this.x + 20, this.y - 25);
    this.ctx.fill();
    
    // 眼睛
    this.ctx.fillStyle = '#000';
    if (this.isBlinking) {
      // 闭眼
      this.ctx.fillRect(this.x - 13 + ex, this.y - 8, 10, 2);
      this.ctx.fillRect(this.x + 3 + ex, this.y - 8, 10, 2);
    } else {
      // 睁眼
      this.ctx.beginPath();
      this.ctx.arc(this.x - 8 + ex, this.y - 5, 5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(this.x + 8 + ex, this.y - 5, 5, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // 鼻子
    this.ctx.fillStyle = '#FF69B4';
    this.ctx.beginPath();
    this.ctx.arc(this.x + ex, this.y + 2, 4, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 睡觉 Zzz
    if (this.state === 'sleeping') {
      this.ctx.fillStyle = 'rgba(100,100,255,0.7)';
      this.ctx.font = 'bold 14px Arial';
      this.ctx.fillText('Z', this.x + 20, this.y - 35);
      if (this.frame % 20 < 10) {
        this.ctx.font = 'bold 10px Arial';
        this.ctx.fillText('z', this.x + 30, this.y - 45);
      }
    }
  }

  feed() {
    this.hunger = Math.min(100, this.hunger + 20);
    this.mood = Math.min(100, this.mood + 5);
  }

  pet() {
    this.mood = Math.min(100, this.mood + 10);
  }

  isPointInside(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < this.bodyRadius + 10;
  }

  getState() {
    return { x: this.x, hunger: this.hunger, mood: this.mood, state: this.state };
  }

  loadState(s) {
    if (s.x !== undefined) this.x = s.x;
    if (s.hunger !== undefined) this.hunger = s.hunger;
    if (s.mood !== undefined) this.mood = s.mood;
    if (s.state !== undefined) this.state = s.state;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Pet;
}