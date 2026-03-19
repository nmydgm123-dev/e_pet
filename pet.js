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
    this.animationFrame = 0;
    this.showStatus = false;
    this.bounceAnimation = 0;
    this.loveAnimation = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.isFrozen = false;
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
        } else if (this.mood > 90 && Math.random() < 0.003) {
          this.state = 'excited';
        } else if (Math.random() < 0.002) {
          this.state = 'stretching';
        } else if (Math.random() < 0.002) {
          this.state = 'chasing';
        }
      } else if (this.state === 'chasing') {
        this.updateChasing();
        if (Math.random() < 0.015) {
          this.state = 'idle';
        }
      } else if (this.state === 'excited') {
        this.updateExcited();
        if (this.animationFrame % 120 === 0) {
          this.state = 'idle';
        }
      } else if (this.state === 'stretching') {
        if (this.animationFrame % 80 === 0) {
          this.state = 'idle';
        }
      } else if (this.state === 'eating') {
        if (this.animationFrame % 100 === 0) {
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
    this.moveX += Math.sin(this.animationFrame * 0.015) * 0.4;
    this.moveY += Math.cos(this.animationFrame * 0.012) * 0.3;
    
    const maxX = this.canvas.width * 0.35;
    const maxY = this.canvas.height * 0.35;
    
    if (Math.abs(this.moveX) > maxX) this.moveX = maxX * Math.sign(this.moveX);
    if (Math.abs(this.moveY) > maxY) this.moveY = maxY * Math.sign(this.moveY);
  }

  updateChasing() {
    this.moveX += Math.sin(this.animationFrame * 0.08) * 2;
    this.moveY += Math.sin(this.animationFrame * 0.05) * 0.8;
    
    const maxX = this.canvas.width * 0.35;
    if (Math.abs(this.moveX) > maxX) this.moveX = maxX * Math.sign(this.moveX);
  }

  updateExcited() {
    this.moveY += Math.sin(this.animationFrame * 0.2) * 1.5;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const baseX = this.x + this.moveX;
    const bounce = this.bounceAnimation > 0 ? Math.sin(this.bounceAnimation * 0.3) * 8 : 0;
    const breathe = Math.sin(this.animationFrame * 0.05) * 2;
    const baseY = this.y + this.moveY + bounce;
    
    this.renderCat(baseX, baseY, breathe);
    
    if (this.showStatus) {
      this.renderStatusBox(baseX, baseY);
    }
  }
  
  renderCat(x, y, breathe) {
    const size = this.size + breathe;
    const scale = this.state === 'excited' ? 1 + Math.sin(this.animationFrame * 0.5) * 0.08 : 1;
    const finalSize = size * scale;
    
    // Shadow
    this.ctx.fillStyle = 'rgba(200, 180, 200, 0.3)';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + finalSize * 0.95, finalSize * 0.8, finalSize * 0.25, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Tail
    const tailWag = Math.sin(this.tailWag * 0.15) * 20;
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 10;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(x - finalSize * 0.6, y + finalSize * 0.3);
    this.ctx.quadraticCurveTo(
      x - finalSize * 1.2, y + finalSize * 0.2 + tailWag,
      x - finalSize * 1.0, y - finalSize * 0.3 + tailWag
    );
    this.ctx.stroke();
    
    // Body
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + finalSize * 0.2, finalSize * 0.75, finalSize * 0.65, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Head
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x, y - finalSize * 0.35, finalSize * 0.65, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Ears
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.moveTo(x - finalSize * 0.55, y - finalSize * 0.55);
    this.ctx.lineTo(x - finalSize * 0.35, y - finalSize * 1.1);
    this.ctx.lineTo(x - finalSize * 0.1, y - finalSize * 0.6);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + finalSize * 0.55, y - finalSize * 0.55);
    this.ctx.lineTo(x + finalSize * 0.35, y - finalSize * 1.1);
    this.ctx.lineTo(x + finalSize * 0.1, y - finalSize * 0.6);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Inner ears
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.moveTo(x - finalSize * 0.45, y - finalSize * 0.6);
    this.ctx.lineTo(x - finalSize * 0.35, y - finalSize * 0.9);
    this.ctx.lineTo(x - finalSize * 0.2, y - finalSize * 0.62);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + finalSize * 0.45, y - finalSize * 0.6);
    this.ctx.lineTo(x + finalSize * 0.35, y - finalSize * 0.9);
    this.ctx.lineTo(x + finalSize * 0.2, y - finalSize * 0.62);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Cheeks
    this.ctx.fillStyle = 'rgba(255, 150, 180, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(x - finalSize * 0.45, y - finalSize * 0.15, finalSize * 0.15, finalSize * 0.1, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(x + finalSize * 0.45, y - finalSize * 0.15, finalSize * 0.15, finalSize * 0.1, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Eyes
    this.renderEyes(x, y, finalSize);
    
    // Nose
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - finalSize * 0.22);
    this.ctx.lineTo(x - finalSize * 0.08, y - finalSize * 0.12);
    this.ctx.lineTo(x + finalSize * 0.08, y - finalSize * 0.12);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Mouth
    this.renderMouth(x, y, finalSize);
    
    // Whiskers
    this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.8)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(x - finalSize * 0.15, y - finalSize * 0.15);
    this.ctx.lineTo(x - finalSize * 0.7, y - finalSize * 0.25);
    this.ctx.moveTo(x - finalSize * 0.15, y - finalSize * 0.08);
    this.ctx.lineTo(x - finalSize * 0.7, y - finalSize * 0.05);
    this.ctx.moveTo(x + finalSize * 0.15, y - finalSize * 0.15);
    this.ctx.lineTo(x + finalSize * 0.7, y - finalSize * 0.25);
    this.ctx.moveTo(x + finalSize * 0.15, y - finalSize * 0.08);
    this.ctx.lineTo(x + finalSize * 0.7, y - finalSize * 0.05);
    this.ctx.stroke();
    
    // Paws
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.ellipse(x - finalSize * 0.35, y + finalSize * 0.7, finalSize * 0.18, finalSize * 0.12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.ellipse(x + finalSize * 0.35, y + finalSize * 0.7, finalSize * 0.18, finalSize * 0.12, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Effects
    if (this.loveAnimation > 0) {
      for (let i = 0; i < 3; i++) {
        const hx = x + (i - 1) * 25 + Math.sin(this.animationFrame * 0.1 + i * 2) * 8;
        const hy = y - finalSize * 1.3 - (30 - this.loveAnimation) * 1.5 - i * 12;
        this.ctx.font = '20px Arial';
        this.ctx.fillText('💗', hx - 10, hy);
      }
    }
    
    if (this.state === 'sleeping') {
      this.ctx.font = '22px Arial';
      this.ctx.fillText('💤', x + finalSize * 0.55, y - finalSize * 0.9);
    }
    
    if (this.state === 'hungry') {
      this.ctx.font = '16px Arial';
      this.ctx.fillText('🍖', x - finalSize * 0.85, y - finalSize * 0.5);
    }
    
    if (this.state === 'chasing') {
      const butterflyX = x + Math.sin(this.animationFrame * 0.15) * finalSize * 0.8;
      const butterflyY = y - finalSize * 1.2 + Math.cos(this.animationFrame * 0.1) * 15;
      this.ctx.font = '18px Arial';
      this.ctx.fillText('🦋', butterflyX - 9, butterflyY);
    }
    
    if (this.isFrozen) {
      this.ctx.font = '16px Arial';
      this.ctx.fillText('❄️', x + finalSize * 0.5, y + finalSize * 0.8);
    }
  }
  
  renderEyes(x, y, size) {
    const blink = this.animationFrame % 200 > 195;
    
    if (this.state === 'sleeping') {
      this.ctx.strokeStyle = '#5D5D5D';
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.28, y - size * 0.35, size * 0.12, Math.PI * 0.1, Math.PI * 0.9);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(x + size * 0.28, y - size * 0.35, size * 0.12, Math.PI * 0.1, Math.PI * 0.9);
      this.ctx.stroke();
    } else if (blink) {
      this.ctx.strokeStyle = '#5D5D5D';
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 0.4, y - size * 0.35);
      this.ctx.lineTo(x - size * 0.15, y - size * 0.35);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x + size * 0.15, y - size * 0.35);
      this.ctx.lineTo(x + size * 0.4, y - size * 0.35);
      this.ctx.stroke();
    } else if (this.state === 'excited') {
      this.ctx.fillStyle = '#5D5D5D';
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.28, y - size * 0.35, size * 0.14, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x + size * 0.28, y - size * 0.35, size * 0.14, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.32, y - size * 0.4, size * 0.05, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x + size * 0.24, y - size * 0.4, size * 0.05, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.fillStyle = '#5D5D5D';
      this.ctx.beginPath();
      this.ctx.ellipse(x - size * 0.28, y - size * 0.35, size * 0.13, size * 0.16, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(x + size * 0.28, y - size * 0.35, size * 0.13, size * 0.16, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.32, y - size * 0.4, size * 0.06, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x + size * 0.24, y - size * 0.4, size * 0.06, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.24, y - size * 0.32, size * 0.03, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x + size * 0.32, y - size * 0.32, size * 0.03, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  renderMouth(x, y, size) {
    this.ctx.strokeStyle = '#E8A0B0';
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    
    if (this.state === 'sleeping') {
      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 0.08, y - size * 0.08);
      this.ctx.lineTo(x + size * 0.08, y - size * 0.08);
      this.ctx.stroke();
    } else if (this.state === 'hungry' || this.state === 'eating') {
      this.ctx.fillStyle = '#FF9999';
      this.ctx.beginPath();
      this.ctx.ellipse(x, y - size * 0.05, size * 0.1, size * 0.08, 0, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (this.state === 'excited' || this.bounceAnimation > 0) {
      this.ctx.beginPath();
      this.ctx.arc(x, y - size * 0.05, size * 0.15, 0.15 * Math.PI, 0.85 * Math.PI);
      this.ctx.stroke();
    } else if (this.mood < 30) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, size * 0.08, 1.15 * Math.PI, 1.85 * Math.PI);
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 0.1, y - size * 0.1);
      this.ctx.lineTo(x, y - size * 0.05);
      this.ctx.lineTo(x + size * 0.1, y - size * 0.1);
      this.ctx.stroke();
    }
  }
  
  renderStatusBox(x, y) {
    const boxWidth = 95;
    const boxHeight = 70;
    let boxX = x + this.size + 20;
    
    if (boxX + boxWidth > this.canvas.width - 40) {
      boxX = x - this.size - boxWidth - 20;
    }
    
    let boxY = y - boxHeight / 2;
    if (boxY < 30) boxY = 30;
    if (boxY + boxHeight > this.canvas.height - 40) {
      boxY = this.canvas.height - boxHeight - 40;
    }
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.shadowColor = 'rgba(255, 150, 180, 0.3)';
    this.ctx.shadowBlur = 12;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 14);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
    
    this.ctx.strokeStyle = '#FFD0E0';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 14);
    this.ctx.stroke();
    
    const barX = boxX + 12;
    const barWidth = 62;
    const barHeight = 10;
    
    this.ctx.font = 'bold 11px system-ui';
    this.ctx.fillStyle = '#555';
    this.ctx.fillText('饱腹', barX, boxY + 20);
    this.ctx.fillText('心情', barX, boxY + 48);
    
    this.ctx.fillStyle = '#F5F5F5';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 24, barWidth, barHeight, 5);
    this.ctx.fill();
    
    const hColor = this.hunger > 60 ? '#7ED57E' : this.hunger > 30 ? '#FFB347' : '#FF7B7B';
    this.ctx.fillStyle = hColor;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 24, barWidth * (this.hunger / 100), barHeight, 5);
    this.ctx.fill();
    
    this.ctx.fillStyle = '#F5F5F5';
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 52, barWidth, barHeight, 5);
    this.ctx.fill();
    
    const mColor = this.mood > 60 ? '#7ED57E' : this.mood > 30 ? '#FFB347' : '#FF7B7B';
    this.ctx.fillStyle = mColor;
    this.ctx.beginPath();
    this.ctx.roundRect(barX, boxY + 52, barWidth * (this.mood / 100), barHeight, 5);
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
