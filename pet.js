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
    
    const bounce = this.bounceAnimation > 0 ? Math.sin(this.bounceAnimation * 0.3) * 8 : 0;
    const breathe = Math.sin(this.animationFrame * 0.05) * 2;
    const baseY = this.y + bounce;
    const currentSize = this.size + breathe;
    
    this.ctx.fillStyle = 'rgba(255, 220, 230, 0.15)';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, baseY + currentSize * 0.8, currentSize * 0.9, currentSize * 0.3, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    const gradient = this.ctx.createRadialGradient(
      this.x - currentSize * 0.3, baseY - currentSize * 0.3, 0,
      this.x, baseY, currentSize
    );
    gradient.addColorStop(0, '#FFE4EC');
    gradient.addColorStop(0.7, '#FFB6C1');
    gradient.addColorStop(1, '#FF9AAF');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.x, baseY, currentSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.x - currentSize * 0.4, 
      baseY - currentSize * 0.4, 
      currentSize * 0.25, 
      currentSize * 0.15, 
      -0.5, 0, Math.PI * 2
    );
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FF85A2';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - currentSize * 0.55, baseY - currentSize * 0.5, currentSize * 0.35, currentSize * 0.45, -0.4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + currentSize * 0.55, baseY - currentSize * 0.5, currentSize * 0.35, currentSize * 0.45, 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - currentSize * 0.55, baseY - currentSize * 0.5, currentSize * 0.2, currentSize * 0.28, -0.4, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + currentSize * 0.55, baseY - currentSize * 0.5, currentSize * 0.2, currentSize * 0.28, 0.4, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFF5F7';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - currentSize * 0.28, baseY + currentSize * 0.1, currentSize * 0.38, currentSize * 0.42, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + currentSize * 0.28, baseY + currentSize * 0.1, currentSize * 0.38, currentSize * 0.42, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#2D2D2D';
    if (this.state === 'sleeping') {
      this.ctx.lineWidth = 4;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - currentSize * 0.42, baseY);
      this.ctx.lineTo(this.x - currentSize * 0.12, baseY);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + currentSize * 0.12, baseY);
      this.ctx.lineTo(this.x + currentSize * 0.42, baseY);
      this.ctx.stroke();
    } else {
      const lookDir = this.direction === 1 ? 3 : -3;
      const blink = this.animationFrame % 150 > 145;
      
      if (blink) {
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(this.x - currentSize * 0.4 + lookDir, baseY);
        this.ctx.lineTo(this.x - currentSize * 0.1 + lookDir, baseY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + currentSize * 0.1 + lookDir, baseY);
        this.ctx.lineTo(this.x + currentSize * 0.4 + lookDir, baseY);
        this.ctx.stroke();
      } else {
        this.ctx.beginPath();
        this.ctx.ellipse(this.x - currentSize * 0.25 + lookDir, baseY, currentSize * 0.14, currentSize * 0.18, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(this.x + currentSize * 0.25 + lookDir, baseY, currentSize * 0.14, currentSize * 0.18, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(this.x - currentSize * 0.22 + lookDir, baseY - currentSize * 0.06, currentSize * 0.06, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.x + currentSize * 0.28 + lookDir, baseY - currentSize * 0.06, currentSize * 0.06, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    
    this.ctx.fillStyle = '#FFB8C9';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - currentSize * 0.5, baseY + currentSize * 0.15, currentSize * 0.12, currentSize * 0.08, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + currentSize * 0.5, baseY + currentSize * 0.15, currentSize * 0.12, currentSize * 0.08, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#E88BA0';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    
    if (this.state === 'sleeping') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - currentSize * 0.15, baseY + currentSize * 0.35);
      this.ctx.lineTo(this.x + currentSize * 0.15, baseY + currentSize * 0.35);
      this.ctx.stroke();
    } else if (this.mood < 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - currentSize * 0.12, baseY + currentSize * 0.4);
      this.ctx.quadraticCurveTo(this.x, baseY + currentSize * 0.3, this.x + currentSize * 0.12, baseY + currentSize * 0.4);
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + currentSize * 0.28, currentSize * 0.15, 0.15 * Math.PI, 0.85 * Math.PI);
      this.ctx.stroke();
    }
    
    this.ctx.fillStyle = '#FF6B9D';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, baseY - currentSize * 0.85, currentSize * 0.12, currentSize * 0.08, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    if (this.loveAnimation > 0) {
      const hearts = Math.floor(this.loveAnimation / 10) + 1;
      this.ctx.font = `${16 + (25 - this.loveAnimation) * 0.5}px Arial`;
      for (let i = 0; i < hearts; i++) {
        const angle = (this.animationFrame * 0.1) + (i * Math.PI / 2);
        const hx = this.x + Math.cos(angle) * (currentSize + 20 + (25 - this.loveAnimation));
        const hy = baseY - currentSize - 10 - Math.sin(angle * 2) * 15 - (25 - this.loveAnimation);
        this.ctx.fillText('❤️', hx - 8, hy);
      }
    }
    
    if (this.state === 'sleeping') {
      this.ctx.fillStyle = 'rgba(135, 206, 250, 0.7)';
      this.ctx.font = 'bold 28px Arial';
      this.ctx.fillText('💤', this.x + currentSize * 0.5, baseY - currentSize * 0.6);
    }
    
    if (this.showStatus) {
      this.renderStatusBox(baseY);
    }
  }
  
  renderStatusBox(baseY) {
    const boxWidth = 120;
    const boxHeight = 90;
    const offsetX = this.x + this.size + 20;
    const offsetY = baseY - boxHeight / 2;
    
    let boxX = offsetX;
    if (offsetX + boxWidth > this.canvas.width - 20) {
      boxX = this.x - this.size - boxWidth - 20;
    }
    
    let boxY = offsetY;
    if (boxY < 20) boxY = 20;
    if (boxY + boxHeight > this.canvas.height - 20) {
      boxY = this.canvas.height - boxHeight - 20;
    }
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.shadowColor = 'rgba(255, 150, 180, 0.3)';
    this.ctx.shadowBlur = 15;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 16);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
    
    this.ctx.strokeStyle = '#FFD1DC';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 16);
    this.ctx.stroke();
    
    const row1Y = boxY + 28;
    const row2Y = boxY + 60;
    
    this.ctx.font = '18px Arial';
    this.ctx.fillText('🍖', boxX + 15, row1Y);
    this.ctx.fillText('❤️', boxX + 15, row2Y);
    
    this.ctx.fillStyle = '#555';
    this.ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.fillText('饱腹', boxX + 38, row1Y - 4);
    this.ctx.fillText('心情', boxX + 38, row2Y - 4);
    
    const barX = boxX + 38;
    const barWidth = 65;
    const barHeight = 8;
    
    this.ctx.fillStyle = '#F0F0F0';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, row1Y - 10, barWidth, barHeight, 4);
    this.ctx.fill();
    
    const hColor = this.hunger > 60 ? '#7ED57E' : this.hunger > 30 ? '#FFB347' : '#FF7B7B';
    this.ctx.fillStyle = hColor;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, row1Y - 10, barWidth * (this.hunger / 100), barHeight, 4);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#888';
    this.ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    this.ctx.fillText(`${Math.round(this.hunger)}%`, barX + barWidth + 5, row1Y - 4);
    
    this.ctx.fillStyle = '#F0F0F0';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, row2Y - 10, barWidth, barHeight, 4);
    this.ctx.fill();
    
    const mColor = this.mood > 60 ? '#7ED57E' : this.mood > 30 ? '#FFB347' : '#FF7B7B';
    this.ctx.fillStyle = mColor;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, row2Y - 10, barWidth * (this.mood / 100), barHeight, 4);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#888';
    this.ctx.fillText(`${Math.round(this.mood)}%`, barX + barWidth + 5, row2Y - 4);
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
