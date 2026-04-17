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
    this.isBeingDragged = false;
    this.effect = null;
    this.effectTimer = 0;
  }

  update() {
    this.frame++;
    
    if (this.effect) {
      this.effectTimer--;
      if (this.effectTimer <= 0) {
        this.effect = null;
      }
    }
    
    // 拖动时暂停移动
    if (this.isBeingDragged) {
      return;
    }
    
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
  
  setDragging(dragging) {
    this.isBeingDragged = dragging;
    if (dragging) {
      this.state = 'idle';
    } else {
      this.state = 'walking';
    }
  }
  
  showPetEffect() {
    this.effect = 'heart';
    this.effectTimer = 30;
  }
  
  showFeedEffect() {
    this.effect = 'food';
    this.effectTimer = 30;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const d = this.direction;
    const ex = d * 3; // 视线偏移

    // 1. 身体（从圆形改为圆角更好的椭圆）
    this.ctx.fillStyle = '#FFFFFF'; // 白色主色
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, this.y + 5, 32, 28, 0, 0, Math.PI * 2);
    this.ctx.fill();
    // 添加一点淡粉色腮红
    this.ctx.fillStyle = 'rgba(255, 182, 193, 0.4)';
    this.ctx.beginPath();
    this.ctx.arc(this.x - 20, this.y + 5, 8, 0, Math.PI * 2);
    this.ctx.arc(this.x + 20, this.y + 5, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. 耳朵（添加粉色内耳）
    const drawEar = (x1, y1, x2, y2, x3, y3, inner) => {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1); this.ctx.lineTo(x2, y2); this.ctx.lineTo(x3, y3);
      this.ctx.fill();
      this.ctx.fillStyle = '#FFC0CB';
      this.ctx.beginPath();
      this.ctx.moveTo(x1 + inner, y1 + 5); this.ctx.lineTo(x2, y2 + 5); this.ctx.lineTo(x3 - inner, y3);
      this.ctx.fill();
    };
    drawEar(this.x - 25, this.y - 20, this.x - 30, this.y - 50, this.x - 5, this.y - 25, 5);
    drawEar(this.x + 5, this.y - 25, this.x + 30, this.y - 50, this.x + 25, this.y - 20, -5);

    // 3. 眼睛（更精致的圆眼）
    this.ctx.fillStyle = '#4A4A4A';
    if (this.isBlinking) {
      this.ctx.fillRect(this.x - 15 + ex, this.y - 5, 10, 3);
      this.ctx.fillRect(this.x + 5 + ex, this.y - 5, 10, 3);
    } else {
      this.ctx.beginPath();
      this.ctx.arc(this.x - 10 + ex, this.y - 5, 6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(this.x + 10 + ex, this.y - 5, 6, 0, Math.PI * 2);
      this.ctx.fill();
      // 眼中高光
      this.ctx.fillStyle = '#FFF';
      this.ctx.beginPath();
      this.ctx.arc(this.x - 12 + ex, this.y - 7, 2, 0, Math.PI * 2);
      this.ctx.arc(this.x + 8 + ex, this.y - 7, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. 小鼻子和嘴巴
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + ex/2, this.y + 5, 4, 3, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#FFB6C1';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + ex/2, this.y + 8);
    this.ctx.quadraticCurveTo(this.x + 5 + ex/2, this.y + 12, this.x + 10 + ex/2, this.y + 8);
    this.ctx.moveTo(this.x + ex/2, this.y + 8);
    this.ctx.quadraticCurveTo(this.x - 5 + ex/2, this.y + 12, this.x - 10 + ex/2, this.y + 8);
    this.ctx.stroke();
    
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
    
    // 特效
    if (this.effect === 'heart') {
      this.ctx.fillStyle = 'rgba(255, 50, 50, ' + (this.effectTimer / 30) + ')';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText('❤', this.x - 8, this.y - 35);
    } else if (this.effect === 'food') {
      this.ctx.fillStyle = 'rgba(255, 165, 0, ' + (this.effectTimer / 30) + ')';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText('🍗', this.x - 8, this.y - 35);
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