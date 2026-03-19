class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 45;
    this.hunger = 100;
    this.mood = 100;
    this.state = 'idle';
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
    const baseY = this.y + bounce;
    
    this.ctx.fillStyle = '#FFE4E1';
    this.ctx.beginPath();
    this.ctx.arc(this.x, baseY, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#FFF5F5';
    this.ctx.beginPath();
    this.ctx.arc(this.x, baseY, this.size, Math.PI * 1.2, Math.PI * 1.8);
    this.ctx.fill();
    
    const blink = this.animationFrame % 200 > 195;
    
    if (blink || this.state === 'sleeping') {
      this.ctx.fillStyle = '#333';
      this.ctx.beginPath();
      this.ctx.ellipse(this.x - 12, baseY - 5, 8, 3, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(this.x + 12, baseY - 5, 8, 3, 0, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.fillStyle = '#333';
      this.ctx.beginPath();
      this.ctx.arc(this.x - 12, baseY - 5, 6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(this.x + 12, baseY - 5, 6, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#FFF';
      this.ctx.beginPath();
      this.ctx.arc(this.x - 10, baseY - 7, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(this.x + 14, baseY - 7, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.strokeStyle = '#FF9999';
    this.ctx.lineWidth = 2;
    if (this.mood < 30) {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + 18, 6, 0.2 * Math.PI, 0.8 * Math.PI);
      this.ctx.stroke();
    } else if (this.bounceAnimation > 0) {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + 12, 8, 0.1 * Math.PI, 0.9 * Math.PI);
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(this.x, baseY + 10, 8, 0.1 * Math.PI, 0.9 * Math.PI);
      this.ctx.stroke();
    }
    
    if (this.loveAnimation > 0) {
      this.ctx.font = '20px Arial';
      this.ctx.fillText('💕', this.x - 10, baseY - this.size - 10);
    }
    
    if (this.state === 'sleeping') {
      this.ctx.font = '18px Arial';
      this.ctx.fillText('💤', this.x + 25, baseY - 25);
    }
    
    if (this.showStatus) {
      this.renderStatusBox(baseY);
    }
  }
  
  renderStatusBox(baseY) {
    const boxWidth = 85;
    const boxHeight = 60;
    let boxX = this.x + this.size + 12;
    
    if (boxX + boxWidth > this.canvas.width - 30) {
      boxX = this.x - this.size - boxWidth - 12;
    }
    
    let boxY = baseY - boxHeight / 2;
    if (boxY < 20) boxY = 20;
    if (boxY + boxHeight > this.canvas.height - 20) {
      boxY = this.canvas.height - boxHeight - 20;
    }
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#FFE4E1';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
    this.ctx.stroke();
    
    const barX = boxX + 8;
    const barWidth = 60;
    const barHeight = 8;
    
    this.ctx.font = '10px system-ui';
    this.ctx.fillStyle = '#666';
    this.ctx.fillText('饱腹', barX, boxY + 16);
    this.ctx.fillText('心情', barX, boxY + 40);
    
    this.ctx.fillStyle = '#EEE';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 19, barWidth, barHeight, 4);
    this.ctx.fill();
    
    this.ctx.fillStyle = this.hunger > 60 ? '#7ED57E' : this.hunger > 30 ? '#FFB347' : '#FF7B7B';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 19, barWidth * (this.hunger / 100), barHeight, 4);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#EEE';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 43, barWidth, barHeight, 4);
    this.ctx.fill();
    
    this.ctx.fillStyle = this.mood > 60 ? '#7ED57E' : this.mood > 30 ? '#FFB347' : '#FF7B7B';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 43, barWidth * (this.mood / 100), barHeight, 4);
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
