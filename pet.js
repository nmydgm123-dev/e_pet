class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 55;
    this.hunger = 100;
    this.mood = 100;
    this.state = 'idle';
    this.direction = 1;
    this.animationFrame = 0;
    this.showStatus = false;
    this.bounceAnimation = 0;
    this.loveAnimation = 0;
  }

  update() {
    this.animationFrame++;
    
    if (this.state === 'sleeping') {
      if (Math.random() < 0.002) {
        this.state = 'idle';
      }
    }
    
    if (this.hunger < 30) {
      this.mood -= 0.008;
      if (this.mood < 0) this.mood = 0;
    }
    
    this.hunger -= 0.003;
    if (this.hunger < 0) this.hunger = 0;
    
    if (this.bounceAnimation > 0) this.bounceAnimation--;
    if (this.loveAnimation > 0) this.loveAnimation--;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const bounce = this.bounceAnimation > 0 ? Math.sin(this.bounceAnimation * 0.3) * 6 : 0;
    const breathe = Math.sin(this.animationFrame * 0.04) * 2;
    const baseY = this.y + bounce;
    const currentSize = this.size + breathe;
    
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.arc(this.x, baseY, currentSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFC0CB';
    this.ctx.beginPath();
    this.ctx.arc(this.x - 32, baseY - 30, 18, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.x + 32, baseY - 30, 18, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.arc(this.x - 32, baseY - 30, 10, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.x + 32, baseY - 30, 10, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFF';
    this.ctx.beginPath();
    this.ctx.arc(this.x - 15, baseY - 5, 18, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.x + 15, baseY - 5, 18, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#333';
    if (this.state === 'sleeping') {
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - 25, baseY - 5);
      this.ctx.lineTo(this.x - 5, baseY - 5);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + 5, baseY - 5);
      this.ctx.lineTo(this.x + 25, baseY - 5);
      this.ctx.stroke();
    } else {
      const lookDir = this.direction === 1 ? 2 : -2;
      const blink = this.animationFrame % 180 > 175;
      
      if (blink) {
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.x - 25 + lookDir, baseY - 5);
        this.ctx.lineTo(this.x - 5 + lookDir, baseY - 5);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 5 + lookDir, baseY - 5);
        this.ctx.lineTo(this.x + 25 + lookDir, baseY - 5);
        this.ctx.stroke();
      } else {
        this.ctx.beginPath();
        this.ctx.arc(this.x - 15 + lookDir, baseY - 5, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.x + 15 + lookDir, baseY - 5, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(this.x - 13 + lookDir, baseY - 8, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.x + 17 + lookDir, baseY - 8, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#333';
      }
    }
    
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.arc(this.x - 25, baseY + 10, 6, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.x + 25, baseY + 10, 6, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FF9999';
    this.ctx.beginPath();
    this.ctx.arc(this.x - 8, baseY + 12, 4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.x + 8, baseY + 12, 4, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#666';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    
    if (this.state === 'sleeping') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - 12, baseY + 22);
      this.ctx.lineTo(this.x + 12, baseY + 22);
      this.ctx.stroke();
    } else if (this.mood < 30) {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + 28, 8, 0.2 * Math.PI, 0.8 * Math.PI);
      this.ctx.stroke();
    } else if (this.bounceAnimation > 0) {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + 20, 12, 0.1 * Math.PI, 0.9 * Math.PI);
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + 18, 10, 0.1 * Math.PI, 0.9 * Math.PI);
      this.ctx.stroke();
    }
    
    if (this.loveAnimation > 0) {
      const heartCount = Math.floor(this.loveAnimation / 8) + 1;
      for (let i = 0; i < heartCount; i++) {
        const hx = this.x + (i - 1) * 20 + Math.sin(this.animationFrame * 0.1 + i) * 5;
        const hy = baseY - currentSize - 15 - (25 - this.loveAnimation) * 0.8 - i * 10;
        this.ctx.font = '16px Arial';
        this.ctx.fillText('💕', hx - 8, hy);
      }
    }
    
    if (this.state === 'sleeping') {
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillText('Z', this.x + 35, baseY - 25);
      this.ctx.font = '18px Arial';
      if (this.animationFrame % 40 < 20) {
        this.ctx.fillText('z', this.x + 48, baseY - 35);
      }
      if (this.animationFrame % 40 > 15) {
        this.ctx.fillText('z', this.x + 55, baseY - 45);
      }
    }
    
    if (this.showStatus) {
      this.renderStatusBox(baseY);
    }
  }
  
  renderStatusBox(baseY) {
    const boxWidth = 95;
    const boxHeight = 70;
    let boxX = this.x + this.size + 15;
    
    if (boxX + boxWidth > this.canvas.width - 30) {
      boxX = this.x - this.size - boxWidth - 15;
    }
    
    let boxY = baseY - boxHeight / 2;
    if (boxY < 20) boxY = 20;
    if (boxY + boxHeight > this.canvas.height - 20) {
      boxY = this.canvas.height - boxHeight - 20;
    }
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.shadowColor = 'rgba(255, 150, 180, 0.4)';
    this.ctx.shadowBlur = 12;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 14);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
    
    this.ctx.strokeStyle = '#FFB6C1';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 14);
    this.ctx.stroke();
    
    const barX = boxX + 12;
    const barWidth = 65;
    const barHeight = 10;
    
    this.ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.fillStyle = '#333';
    this.ctx.fillText('饱腹', barX, boxY + 22);
    this.ctx.fillText('心情', barX, boxY + 50);
    
    this.ctx.fillStyle = '#EEE';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 26, barWidth, barHeight, 5);
    this.ctx.fill();
    
    const hColor = this.hunger > 60 ? '#5CB85C' : this.hunger > 30 ? '#F0AD4E' : '#D9534F';
    this.ctx.fillStyle = hColor;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 26, barWidth * (this.hunger / 100), barHeight, 5);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#EEE';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 54, barWidth, barHeight, 5);
    this.ctx.fill();
    
    const mColor = this.mood > 60 ? '#5CB85C' : this.mood > 30 ? '#F0AD4E' : '#D9534F';
    this.ctx.fillStyle = mColor;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 54, barWidth * (this.mood / 100), barHeight, 5);
    this.ctx.fill();
  }

  feed() {
    this.hunger = Math.min(100, this.hunger + 30);
    this.mood = Math.min(100, this.mood + 5);
    this.bounceAnimation = 30;
  }

  pet() {
    this.mood = Math.min(100, this.mood + 25);
    this.bounceAnimation = 25;
    this.loveAnimation = 25;
  }
  
  toggleSleep() {
    this.state = this.state === 'sleeping' ? 'idle' : 'sleeping';
  }
}

window.Pet = Pet;
