class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 50;
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
    
    const bounce = this.bounceAnimation > 0 ? Math.sin(this.bounceAnimation * 0.3) * 5 : 0;
    const breathe = Math.sin(this.animationFrame * 0.05) * 1.5;
    const baseY = this.y + bounce;
    const currentSize = this.size + breathe;
    
    this.ctx.fillStyle = '#FFDDE5';
    this.ctx.beginPath();
    this.ctx.arc(this.x, baseY, currentSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FF85A1';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - currentSize * 0.5, baseY - currentSize * 0.6, currentSize * 0.25, currentSize * 0.35, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + currentSize * 0.5, baseY - currentSize * 0.6, currentSize * 0.25, currentSize * 0.35, 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - currentSize * 0.5, baseY - currentSize * 0.6, currentSize * 0.12, currentSize * 0.2, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + currentSize * 0.5, baseY - currentSize * 0.6, currentSize * 0.12, currentSize * 0.2, 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    const blink = this.animationFrame % 200 > 195;
    
    if (blink) {
      this.ctx.strokeStyle = '#4A4A4A';
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - currentSize * 0.35, baseY);
      this.ctx.lineTo(this.x - currentSize * 0.1, baseY);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + currentSize * 0.1, baseY);
      this.ctx.lineTo(this.x + currentSize * 0.35, baseY);
      this.ctx.stroke();
    } else {
      this.ctx.fillStyle = '#4A4A4A';
      this.ctx.beginPath();
      this.ctx.arc(this.x - currentSize * 0.22, baseY, currentSize * 0.18, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(this.x + currentSize * 0.22, baseY, currentSize * 0.18, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#FFF';
      this.ctx.beginPath();
      this.ctx.arc(this.x - currentSize * 0.18, baseY - currentSize * 0.08, currentSize * 0.07, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(this.x + currentSize * 0.26, baseY - currentSize * 0.08, currentSize * 0.07, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - currentSize * 0.45, baseY + currentSize * 0.15, currentSize * 0.12, currentSize * 0.08, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + currentSize * 0.45, baseY + currentSize * 0.15, currentSize * 0.12, currentSize * 0.08, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#666';
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    
    if (this.state === 'sleeping') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - currentSize * 0.15, baseY + currentSize * 0.35);
      this.ctx.lineTo(this.x + currentSize * 0.15, baseY + currentSize * 0.35);
      this.ctx.stroke();
    } else if (this.mood < 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - currentSize * 0.12, baseY + currentSize * 0.4);
      this.ctx.quadraticCurveTo(this.x, baseY + currentSize * 0.28, this.x + currentSize * 0.12, baseY + currentSize * 0.4);
      this.ctx.stroke();
    } else if (this.bounceAnimation > 0) {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + currentSize * 0.25, currentSize * 0.18, 0, Math.PI);
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + currentSize * 0.22, currentSize * 0.15, 0.1 * Math.PI, 0.9 * Math.PI);
      this.ctx.stroke();
    }
    
    if (this.loveAnimation > 0) {
      for (let i = 0; i < 3; i++) {
        const hx = this.x + (i - 1) * 25 + Math.sin(this.animationFrame * 0.15 + i) * 8;
        const hy = baseY - currentSize - 20 - (30 - this.loveAnimation) * 1.2 - i * 15;
        this.ctx.font = '18px Arial';
        this.ctx.fillText('💗', hx - 9, hy);
      }
    }
    
    if (this.state === 'sleeping') {
      this.ctx.font = 'bold 22px Arial';
      this.ctx.fillText('💤', this.x + currentSize * 0.6, baseY - currentSize * 0.4);
    }
    
    if (this.showStatus) {
      this.renderStatusBox(baseY);
    }
  }
  
  renderStatusBox(baseY) {
    const boxWidth = 90;
    const boxHeight = 65;
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
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 12);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#FFDDE5';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 12);
    this.ctx.stroke();
    
    const barX = boxX + 10;
    const barWidth = 60;
    const barHeight = 8;
    
    this.ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.fillStyle = '#555';
    this.ctx.fillText('饱腹', barX, boxY + 18);
    this.ctx.fillText('心情', barX, boxY + 45);
    
    this.ctx.fillStyle = '#F0F0F0';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 21, barWidth, barHeight, 4);
    this.ctx.fill();
    
    const hColor = this.hunger > 60 ? '#7ED57E' : this.hunger > 30 ? '#FFB347' : '#FF7B7B';
    this.ctx.fillStyle = hColor;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 21, barWidth * (this.hunger / 100), barHeight, 4);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#F0F0F0';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 48, barWidth, barHeight, 4);
    this.ctx.fill();
    
    const mColor = this.mood > 60 ? '#7ED57E' : this.mood > 30 ? '#FFB347' : '#FF7B7B';
    this.ctx.fillStyle = mColor;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 48, barWidth * (this.mood / 100), barHeight, 4);
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
    this.loveAnimation = 30;
  }
  
  toggleSleep() {
    this.state = this.state === 'sleeping' ? 'idle' : 'sleeping';
  }
}

window.Pet = Pet;
