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
    this.animationFrame = 0;
    this.showStatus = false;
    this.bounceAnimation = 0;
    this.loveAnimation = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.moveSpeed = 0.5;
    this.isFrozen = false;
    this.direction = 1;
    this.tailWag = 0;
  }

  update() {
    this.animationFrame++;
    this.tailWag++;
    
    if (this.isFrozen) {
      if (this.state !== 'sleeping' && Math.random() < 0.6) {
        this.state = 'sleeping';
      }
    } else {
      if (this.state === 'sleeping') {
        if (Math.random() < 0.003) {
          this.state = 'idle';
        }
      } else if (this.state === 'idle') {
        this.updateIdleMovement();
        
        if (this.hunger < 30) {
          this.state = 'hungry';
        } else if (this.mood > 90 && Math.random() < 0.002) {
          this.state = 'excited';
        } else if (Math.random() < 0.001) {
          this.state = 'stretching';
        } else if (Math.random() < 0.001) {
          this.state = 'chasing';
        }
      } else if (this.state === 'chasing') {
        this.updateChasing();
        if (Math.random() < 0.01) {
          this.state = 'idle';
        }
      } else if (this.state === 'excited') {
        this.updateExcited();
        if (this.animationFrame % 100 === 0) {
          this.state = 'idle';
        }
      } else if (this.state === 'stretching') {
        if (this.animationFrame % 60 === 0) {
          this.state = 'idle';
        }
      } else if (this.state === 'eating') {
        if (this.animationFrame % 80 === 0) {
          this.state = 'idle';
        }
      }
    }
    
    if (this.hunger < 30) {
      this.mood -= 0.008;
      if (this.mood < 0) this.mood = 0;
    }
    
    if (this.state !== 'sleeping' && this.state !== 'eating') {
      this.hunger -= 0.003;
    }
    if (this.hunger < 0) this.hunger = 0;
    
    if (this.bounceAnimation > 0) this.bounceAnimation--;
    if (this.loveAnimation > 0) this.loveAnimation--;
  }

  updateIdleMovement() {
    this.moveX += Math.sin(this.animationFrame * 0.02) * 0.3;
    this.moveY += Math.cos(this.animationFrame * 0.015) * 0.2;
    
    const maxX = this.canvas.width * 0.4;
    const maxY = this.canvas.height * 0.4;
    
    if (Math.abs(this.moveX) > maxX) this.moveX = maxX * Math.sign(this.moveX);
    if (Math.abs(this.moveY) > maxY) this.moveY = maxY * Math.sign(this.moveY);
    
    if (this.moveX > 0) this.direction = 1;
    else if (this.moveX < 0) this.direction = -1;
  }

  updateChasing() {
    this.moveX += this.direction * 1.5;
    this.moveY += Math.sin(this.animationFrame * 0.3) * 0.5;
    
    const maxX = this.canvas.width * 0.4;
    if (Math.abs(this.moveX) > maxX) {
      this.moveX = maxX * Math.sign(this.moveX);
      this.direction *= -1;
    }
  }

  updateExcited() {
    this.moveY += Math.sin(this.animationFrame * 0.3) * 1;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const baseX = this.x + this.moveX;
    const bounce = this.bounceAnimation > 0 ? Math.sin(this.bounceAnimation * 0.3) * 8 : 0;
    const baseY = this.y + this.moveY + bounce;
    
    this.renderCat(baseX, baseY);
    
    if (this.showStatus) {
      this.renderStatusBox(baseX, baseY);
    }
  }
  
  renderCat(x, y) {
    const scale = this.state === 'excited' ? 1 + Math.sin(this.animationFrame * 0.5) * 0.1 : 1;
    const size = this.size * scale;
    
    // Shadow
    this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + size * 0.9, size * 0.7, size * 0.2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Tail
    this.ctx.strokeStyle = '#FFF';
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    const tailWave = Math.sin(this.tailWag * 0.1) * 15;
    this.ctx.moveTo(x - this.direction * size * 0.5, y + size * 0.2);
    this.ctx.quadraticCurveTo(
      x - this.direction * size * 0.8, y - size * 0.3 + tailWave,
      x - this.direction * size * 0.6, y - size * 0.6 + tailWave
    );
    this.ctx.stroke();
    
    // Body
    const bodyGradient = this.ctx.createRadialGradient(x - size * 0.2, y - size * 0.2, 0, x, y, size);
    bodyGradient.addColorStop(0, '#FFFFFF');
    bodyGradient.addColorStop(1, '#FFE4E8');
    this.ctx.fillStyle = bodyGradient;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, size * 0.9, size * 0.75, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Head
    this.ctx.fillStyle = '#FFF';
    this.ctx.beginPath();
    this.ctx.arc(x, y - size * 0.4, size * 0.7, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Ears
    this.ctx.fillStyle = '#FFF';
    this.ctx.beginPath();
    this.ctx.moveTo(x - size * 0.55, y - size * 0.7);
    this.ctx.lineTo(x - size * 0.35, y - size * 1.2);
    this.ctx.lineTo(x - size * 0.15, y - size * 0.7);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(x + size * 0.55, y - size * 0.7);
    this.ctx.lineTo(x + size * 0.35, y - size * 1.2);
    this.ctx.lineTo(x + size * 0.15, y - size * 0.7);
    this.ctx.fill();
    
    // Inner ears
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.moveTo(x - size * 0.45, y - size * 0.75);
    this.ctx.lineTo(x - size * 0.35, y - size * 1.05);
    this.ctx.lineTo(x - size * 0.25, y - size * 0.75);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(x + size * 0.45, y - size * 0.75);
    this.ctx.lineTo(x + size * 0.35, y - size * 1.05);
    this.ctx.lineTo(x + size * 0.25, y - size * 0.75);
    this.ctx.fill();
    
    // Paws
    if (this.state === 'stretching') {
      // Extended paws
      this.ctx.fillStyle = '#FFF';
      this.ctx.beginPath();
      this.ctx.ellipse(x - size * 0.6, y + size * 0.5, size * 0.25, size * 0.15, -0.3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(x + size * 0.6, y + size * 0.5, size * 0.25, size * 0.15, 0.3, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.state === 'chasing') {
      // Running paws
      const pawOffset = Math.sin(this.animationFrame * 0.5) * size * 0.2;
      this.ctx.fillStyle = '#FFF';
      this.ctx.beginPath();
      this.ctx.ellipse(x - size * 0.35 + pawOffset, y + size * 0.6, size * 0.18, size * 0.12, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(x + size * 0.35 - pawOffset, y + size * 0.6, size * 0.18, size * 0.12, 0, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.fillStyle = '#FFF';
      this.ctx.beginPath();
      this.ctx.ellipse(x - size * 0.35, y + size * 0.65, size * 0.2, size * 0.15, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(x + size * 0.35, y + size * 0.65, size * 0.2, size * 0.15, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Eyes
    this.renderEyes(x, y, size);
    
    // Nose
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size * 0.25);
    this.ctx.lineTo(x - size * 0.08, y - size * 0.15);
    this.ctx.lineTo(x + size * 0.08, y - size * 0.15);
    this.ctx.fill();
    
    // Mouth
    this.renderMouth(x, y, size);
    
    // Whiskers
    this.ctx.strokeStyle = '#DDD';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(x - size * 0.2, y - size * 0.2);
    this.ctx.lineTo(x - size * 0.7, y - size * 0.3);
    this.ctx.moveTo(x - size * 0.2, y - size * 0.15);
    this.ctx.lineTo(x - size * 0.7, y - size * 0.15);
    this.ctx.moveTo(x + size * 0.2, y - size * 0.2);
    this.ctx.lineTo(x + size * 0.7, y - size * 0.3);
    this.ctx.moveTo(x + size * 0.2, y - size * 0.15);
    this.ctx.lineTo(x + size * 0.7, y - size * 0.15);
    this.ctx.stroke();
    
    // Cheeks
    this.ctx.fillStyle = 'rgba(255, 182, 193, 0.5)';
    this.ctx.beginPath();
    this.ctx.arc(x - size * 0.4, y - size * 0.2, size * 0.12, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.12, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Effects
    if (this.loveAnimation > 0) {
      this.ctx.font = '18px Arial';
      this.ctx.fillText('💕', x - 9, y - size - 10 - this.loveAnimation * 0.5);
    }
    
    if (this.state === 'sleeping') {
      this.ctx.font = '20px Arial';
      this.ctx.fillText('💤', x + size * 0.5, y - size * 0.9);
    }
    
    if (this.state === 'hungry') {
      this.ctx.font = '14px Arial';
      this.ctx.fillText('🍽️', x + size * 0.5, y - size * 0.5);
    }
    
    if (this.state === 'chasing') {
      this.ctx.font = '16px Arial';
      const butterflyX = x + this.direction * (size + 20 + Math.sin(this.animationFrame * 0.1) * 10);
      const butterflyY = y - 20 + Math.cos(this.animationFrame * 0.1) * 10;
      this.ctx.fillText('🦋', butterflyX, butterflyY);
    }
  }
  
  renderEyes(x, y, size) {
    const blink = this.animationFrame % 180 > 175;
    
    if (this.state === 'sleeping') {
      this.ctx.strokeStyle = '#333';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 0.3, y - size * 0.4);
      this.ctx.lineTo(x - size * 0.1, y - size * 0.4);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x + size * 0.1, y - size * 0.4);
      this.ctx.lineTo(x + size * 0.3, y - size * 0.4);
      this.ctx.stroke();
    } else if (blink) {
      this.ctx.strokeStyle = '#333';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 0.35, y - size * 0.4);
      this.ctx.lineTo(x - size * 0.1, y - size * 0.4);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x + size * 0.1, y - size * 0.4);
      this.ctx.lineTo(x + size * 0.35, y - size * 0.4);
      this.ctx.stroke();
    } else if (this.state === 'excited') {
      this.ctx.fillStyle = '#333';
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.22, y - size * 0.4, size * 0.12, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x + size * 0.22, y - size * 0.4, size * 0.12, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#FFF';
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.25, y - size * 0.45, size * 0.05, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x + size * 0.19, y - size * 0.45, size * 0.05, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.fillStyle = '#333';
      this.ctx.beginPath();
      this.ctx.ellipse(x - size * 0.22, y - size * 0.4, size * 0.1, size * 0.14, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(x + size * 0.22, y - size * 0.4, size * 0.1, size * 0.14, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#FFF';
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.25, y - size * 0.45, size * 0.04, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x + size * 0.19, y - size * 0.45, size * 0.04, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  renderMouth(x, y, size) {
    this.ctx.strokeStyle = '#FF9999';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    
    if (this.state === 'sleeping') {
      this.ctx.beginPath();
      this.ctx.arc(x, y - size * 0.1, size * 0.08, 0, Math.PI);
      this.ctx.stroke();
    } else if (this.state === 'hungry') {
      this.ctx.beginPath();
      this.ctx.ellipse(x, y - size * 0.08, size * 0.1, size * 0.08, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FF9999';
      this.ctx.fill();
    } else if (this.state === 'eating') {
      const munch = Math.sin(this.animationFrame * 0.5);
      this.ctx.beginPath();
      this.ctx.arc(x, y - size * 0.08 + munch * 2, size * 0.06, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FF9999';
      this.ctx.fill();
    } else if (this.state === 'excited' || this.bounceAnimation > 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 0.1, y - size * 0.12);
      this.ctx.quadraticCurveTo(x, y - size * 0.02, x + size * 0.1, y - size * 0.12);
      this.ctx.stroke();
    } else if (this.mood < 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 0.08, y - size * 0.05);
      this.ctx.quadraticCurveTo(x, y - size * 0.12, x + size * 0.08, y - size * 0.05);
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - size * 0.15);
      this.ctx.lineTo(x, y - size * 0.08);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(x, y - size * 0.08, size * 0.08, 0.2 * Math.PI, 0.8 * Math.PI);
      this.ctx.stroke();
    }
  }
  
  renderStatusBox(x, y) {
    const boxWidth = 90;
    const boxHeight = 65;
    let boxX = x + this.size + 15;
    
    if (boxX + boxWidth > this.canvas.width - 30) {
      boxX = x - this.size - boxWidth - 15;
    }
    
    let boxY = y - boxHeight / 2;
    if (boxY < 20) boxY = 20;
    if (boxY + boxHeight > this.canvas.height - 20) {
      boxY = this.canvas.height - boxHeight - 20;
    }
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 12);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
    
    this.ctx.strokeStyle = '#FFB6C1';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 12);
    this.ctx.stroke();
    
    const barX = boxX + 10;
    const barWidth = 60;
    const barHeight = 8;
    
    this.ctx.font = '10px system-ui';
    this.ctx.fillStyle = '#666';
    this.ctx.fillText('饱腹', barX, boxY + 16);
    this.ctx.fillText('心情', barX, boxY + 42);
    
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
    this.ctx.roundRect(barX, boxY + 45, barWidth, barHeight, 4);
    this.ctx.fill();
    
    this.ctx.fillStyle = this.mood > 60 ? '#7ED57E' : this.mood > 30 ? '#FFB347' : '#FF7B7B';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 45, barWidth * (this.mood / 100), barHeight, 4);
    this.ctx.fill();
  }

  feed() {
    this.hunger = Math.min(100, this.hunger + 30);
    this.mood = Math.min(100, this.mood + 5);
    this.state = 'eating';
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
  
  toggleFreeze() {
    this.isFrozen = !this.isFrozen;
    if (this.isFrozen && this.state !== 'sleeping') {
      if (Math.random() < 0.6) {
        this.state = 'sleeping';
      }
    }
    return this.isFrozen;
  }
}

window.Pet = Pet;
