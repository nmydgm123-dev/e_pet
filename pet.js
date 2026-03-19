class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height / 2 - 30;
    this.size = 50;
    this.hunger = 100;
    this.mood = 100;
    this.state = 'idle';
    this.direction = 1;
    this.animationFrame = 0;
    this.showStatus = false;
    this.bounceAnimation = 0;
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
    
    this.hunger -= 0.004;
    if (this.hunger < 0) this.hunger = 0;
    
    if (this.bounceAnimation > 0) {
      this.bounceAnimation--;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const bounceOffset = this.bounceAnimation > 0 ? Math.sin(this.bounceAnimation * 0.4) * 6 : 0;
    const baseY = this.y + bounceOffset;
    
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.arc(this.x, baseY, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFC0CB';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - 28, baseY - 25, 18, 22, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + 28, baseY - 25, 18, 22, 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - 28, baseY - 25, 10, 14, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + 28, baseY - 25, 10, 14, 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFF';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x - 14, baseY - 5, 16, 18, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(this.x + 14, baseY - 5, 16, 18, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#2D2D2D';
    if (this.state === 'sleeping') {
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - 22, baseY - 5);
      this.ctx.lineTo(this.x - 6, baseY - 5);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + 6, baseY - 5);
      this.ctx.lineTo(this.x + 22, baseY - 5);
      this.ctx.stroke();
    } else {
      const lookDir = this.direction === 1 ? 2 : -2;
      const blinkChance = this.animationFrame % 180;
      if (blinkChance < 8 || blinkChance > 172) {
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(this.x - 22 + lookDir, baseY - 5);
        this.ctx.lineTo(this.x - 6 + lookDir, baseY - 5);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + 6 + lookDir, baseY - 5);
        this.ctx.lineTo(this.x + 22 + lookDir, baseY - 5);
        this.ctx.stroke();
      } else {
        this.ctx.beginPath();
        this.ctx.ellipse(this.x - 14 + lookDir, baseY - 5, 8, 10, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(this.x + 14 + lookDir, baseY - 5, 8, 10, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(this.x - 12 + lookDir, baseY - 8, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.x + 16 + lookDir, baseY - 8, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    
    this.ctx.fillStyle = '#FF69B4';
    this.ctx.beginPath();
    this.ctx.ellipse(this.x, baseY + 12, 6, 4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#2D2D2D';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    
    if (this.state === 'sleeping') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - 10, baseY + 20);
      this.ctx.lineTo(this.x + 10, baseY + 20);
      this.ctx.stroke();
    } else if (this.hunger < 25 || this.mood < 25) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - 8, baseY + 24);
      this.ctx.quadraticCurveTo(this.x, baseY + 18, this.x + 8, baseY + 24);
      this.ctx.stroke();
    } else if (this.bounceAnimation > 0) {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + 16, 10, 0.1 * Math.PI, 0.9 * Math.PI);
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - 10, baseY + 18);
      this.ctx.quadraticCurveTo(this.x, baseY + 28, this.x + 10, baseY + 18);
      this.ctx.stroke();
    }
    
    if (this.state === 'sleeping') {
      this.ctx.fillStyle = 'rgba(100, 149, 237, 0.7)';
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillText('Z', this.x + 30, baseY - 25);
      
      this.ctx.font = '18px Arial';
      if (this.animationFrame % 50 < 25) {
        this.ctx.fillText('z', this.x + 45, baseY - 35);
      }
      if (this.animationFrame % 50 > 15) {
        this.ctx.fillText('z', this.x + 55, baseY - 45);
      }
    }
    
    if (this.showStatus) {
      const boxWidth = 100;
      const boxHeight = 65;
      const boxX = (this.canvas.width - boxWidth) / 2;
      const boxY = this.canvas.height - boxHeight - 8;
      
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      this.ctx.beginPath();
      this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
      this.ctx.fill();
      
      this.ctx.strokeStyle = '#FFB6C1';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
      this.ctx.stroke();
      
      const barWidth = 70;
      const barHeight = 10;
      const barX = boxX + 12;
      
      this.ctx.fillStyle = '#333';
      this.ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
      this.ctx.fillText('饱腹', barX, boxY + 18);
      
      this.ctx.fillStyle = '#EEE';
      this.ctx.beginPath();
      this.ctx.roundRect(barX + 8, boxY + 22, barWidth, barHeight, 5);
      this.ctx.fill();
      
      const hungerColor = this.hunger > 60 ? '#5CB85C' : this.hunger > 30 ? '#F0AD4E' : '#D9534F';
      this.ctx.fillStyle = hungerColor;
      this.ctx.beginPath();
      this.ctx.roundRect(barX + 8, boxY + 22, barWidth * (this.hunger / 100), barHeight, 5);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#333';
      this.ctx.fillText('心情', barX, boxY + 48);
      
      this.ctx.fillStyle = '#EEE';
      this.ctx.beginPath();
      this.ctx.roundRect(barX + 8, boxY + 52, barWidth, barHeight, 5);
      this.ctx.fill();
      
      const moodColor = this.mood > 60 ? '#5CB85C' : this.mood > 30 ? '#F0AD4E' : '#D9534F';
      this.ctx.fillStyle = moodColor;
      this.ctx.beginPath();
      this.ctx.roundRect(barX + 8, boxY + 52, barWidth * (this.mood / 100), barHeight, 5);
      this.ctx.fill();
    }
  }

  feed() {
    this.hunger = Math.min(100, this.hunger + 30);
    this.mood = Math.min(100, this.mood + 5);
    this.bounceAnimation = 25;
  }

  pet() {
    this.mood = Math.min(100, this.mood + 25);
    this.bounceAnimation = 20;
  }
  
  toggleSleep() {
    if (this.state === 'sleeping') {
      this.state = 'idle';
    } else {
      this.state = 'sleeping';
    }
  }
}

window.Pet = Pet;
