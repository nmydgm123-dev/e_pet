# e_pet 桌面宠物应用实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建一个适用于 Mac 的电子宠物桌面应用，使用 Electron + Canvas 2D 实现透明悬浮窗效果

**Architecture:** 主进程创建透明窗口，渲染进程使用 Canvas 2D 绘制宠物并处理交互，状态机控制宠物行为，localStorage 持久化状态

**Tech Stack:** Electron, HTML5 Canvas, JavaScript, CSS

---

## Task 1: 初始化项目结构

**Files:**
- Create: `package.json`
- Create: `main.js`
- Create: `index.html`
- Create: `style.css`
- Create: `renderer.js`
- Create: `pet.js`

**Step 1: 创建 package.json**

```json
{
  "name": "e_pet",
  "version": "1.0.0",
  "description": "Mac 桌面电子宠物",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^28.0.0"
  }
}
```

**Step 2: 安装依赖**

Run: `npm install`
Expected: 安装成功，无错误

**Step 3: 创建 main.js（基础框架）**

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  win.setAlwaysOnTop(true, 'floating');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

**Step 4: 创建 index.html**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>e_pet</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <canvas id="petCanvas"></canvas>
  <script src="pet.js"></script>
  <script src="renderer.js"></script>
</body>
</html>
```

**Step 5: 创建 style.css**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: transparent;
  overflow: hidden;
  -webkit-app-region: drag;
}

canvas {
  display: block;
  -webkit-app-region: no-drag;
}
```

**Step 6: 创建空的 renderer.js 和 pet.js**

```javascript
// renderer.js
// 待实现
```

```javascript
// pet.js
// 待实现
```

**Step 7: 提交**

```bash
git add .
git commit -m "feat: 初始化项目结构"
```

---

## Task 2: 实现 Pet 类

**Files:**
- Create: `pet.js`
- Modify: `renderer.js`

**Step 1: 创建 Pet 类**

```javascript
class Pet {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.size = 30;
    this.hunger = 100;
    this.mood = 100;
    this.state = 'walking';
    this.direction = 1;
    this.speed = 1;
    this.animationFrame = 0;
  }

  update() {
    this.animationFrame++;
    
    if (this.state === 'walking') {
      this.x += this.speed * this.direction;
      
      if (this.x > this.canvas.width - this.size || this.x < this.size) {
        this.direction *= -1;
      }
      
      this.hunger -= 0.01;
      if (this.hunger < 0) this.hunger = 0;
    }
    
    if (this.hunger < 30) {
      this.mood -= 0.02;
      if (this.mood < 0) this.mood = 0;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制宠物身体
    this.ctx.fillStyle = '#FFB6C1';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 绘制眼睛
    this.ctx.fillStyle = '#000';
    const eyeOffset = this.direction === 1 ? 5 : -5;
    this.ctx.beginPath();
    this.ctx.arc(this.x - 8 + eyeOffset, this.y - 5, 3, 0, Math.PI * 2);
    this.ctx.arc(this.x + 8 + eyeOffset, this.y - 5, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 眨眼动画
    if (this.animationFrame % 120 < 10) {
      this.ctx.fillStyle = '#FFB6C1';
      this.ctx.fillRect(this.x - 12 + eyeOffset, this.y - 8, 10, 6);
      this.ctx.fillRect(this.x + 2 + eyeOffset, this.y - 8, 10, 6);
    }
    
    // 绘制嘴巴
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(this.x + eyeOffset, this.y + 5, 5, 0, Math.PI);
    this.ctx.stroke();
  }

  feed() {
    this.hunger = Math.min(100, this.hunger + 20);
    this.mood = Math.min(100, this.mood + 10);
  }

  pet() {
    this.mood = Math.min(100, this.mood + 15);
  }
}

module.exports = Pet;
```

**Step 2: 在 renderer.js 中使用 Pet 类**

```javascript
const Pet = require('./pet');

const canvas = document.getElementById('petCanvas');
canvas.width = 200;
canvas.height = 200;

const pet = new Pet(canvas);

function gameLoop() {
  pet.update();
  pet.render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
```

**Step 3: 测试应用**

Run: `npm start`
Expected: 显示透明窗口，粉色圆形宠物在窗口内左右移动

**Step 4: 提交**

```bash
git add pet.js renderer.js
git commit -m "feat: 实现 Pet 类基础动画"
```

---

## Task 3: 实现交互功能

**Files:**
- Modify: `renderer.js`
- Modify: `pet.js`

**Step 1: 添加点击交互到 renderer.js**

```javascript
const Pet = require('./pet');

const canvas = document.getElementById('petCanvas');
canvas.width = 200;
canvas.height = 200;

const pet = new Pet(canvas);

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const distance = Math.sqrt(
    Math.pow(x - pet.x, 2) + Math.pow(y - pet.y, 2)
  );
  
  if (distance < pet.size) {
    if (e.shiftKey) {
      pet.feed();
    } else {
      pet.pet();
    }
  }
});

function gameLoop() {
  pet.update();
  pet.render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
```

**Step 2: 添加状态显示到 pet.js**

在 Pet 类的 render 方法末尾添加：

```javascript
// 状态显示
this.ctx.fillStyle = '#000';
this.ctx.font = '12px Arial';
this.ctx.fillText(`饥饿: ${Math.round(this.hunger)}`, 10, 20);
this.ctx.fillText(`心情: ${Math.round(this.mood)}`, 10, 35);
```

**Step 3: 测试交互**

Run: `npm start`
- 点击宠物：心情增加
- Shift+点击宠物：饥饿值增加
- 状态栏显示实时数值

**Step 4: 提交**

```bash
git add renderer.js pet.js
git commit -m "feat: 实现点击交互和状态显示"
```

---

## Task 4: 实现状态持久化

**Files:**
- Modify: `renderer.js`

**Step 1: 添加 localStorage 保存/加载**

在 renderer.js 中添加：

```javascript
function saveState() {
  const state = {
    x: pet.x,
    hunger: pet.hunger,
    mood: pet.mood,
    state: pet.state
  };
  localStorage.setItem('petState', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('petState');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      pet.x = state.x || pet.x;
      pet.hunger = state.hunger || pet.hunger;
      pet.mood = state.mood || pet.mood;
      pet.state = state.state || pet.state;
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }
}

// 启动时加载状态
loadState();

// 定时保存状态
setInterval(saveState, 30000);

// 关闭前保存
window.addEventListener('beforeunload', saveState);
```

**Step 2: 测试状态持久化**

1. Run: `npm start`
2. 与宠物互动，改变状态
3. 关闭应用
4. 重新 Run: `npm start`
5. 验证状态已恢复

**Step 3: 提交**

```bash
git add renderer.js
git commit -m "feat: 实现状态持久化"
```

---

## Task 5: 优化和完善

**Files:**
- Modify: `pet.js`
- Modify: `style.css`

**Step 1: 添加空闲/睡眠状态**

在 Pet 类中添加状态逻辑：

```javascript
update() {
  this.animationFrame++;
  
  if (this.state === 'walking') {
    this.x += this.speed * this.direction;
    
    if (this.x > this.canvas.width - this.size || this.x < this.size) {
      this.direction *= -1;
    }
    
    this.hunger -= 0.01;
    if (this.hunger < 0) this.hunger = 0;
    
    // 随机进入睡眠
    if (Math.random() < 0.001) {
      this.state = 'sleeping';
    }
  } else if (this.state === 'sleeping') {
    // 随机醒来
    if (Math.random() < 0.005) {
      this.state = 'walking';
    }
  }
  
  if (this.hunger < 30) {
    this.mood -= 0.02;
    if (this.mood < 0) this.mood = 0;
  }
}
```

**Step 2: 添加睡眠动画**

在 render 方法中添加：

```javascript
if (this.state === 'sleeping') {
  this.ctx.fillStyle = '#000';
  this.ctx.font = '20px Arial';
  this.ctx.fillText('Z', this.x + 20, this.y - 20);
  
  if (this.animationFrame % 60 < 30) {
    this.ctx.fillText('z', this.x + 30, this.y - 30);
  }
}
```

**Step 3: 测试完整功能**

Run: `npm start`
- 验证宠物可以走动、睡觉
- 验证点击抚摸和喂食功能
- 验证状态持久化

**Step 4: 最终提交**

```bash
git add pet.js style.css
git commit -m "feat: 添加睡眠状态和动画优化"
```

---

## 验证清单

1. **启动测试**: `npm start` 成功启动透明悬浮窗
2. **显示测试**: 宠物在窗口内正确显示
3. **动画测试**: 宠物可以左右移动
4. **交互测试**: 点击抚摸增加心情，Shift+点击喂食增加饥饿值
5. **状态测试**: 关闭重启后状态保持
6. **性能测试**: CPU 使用率正常，无卡顿

## 后续优化建议

- 添加更多宠物种类
- 实现宠物成长系统
- 添加音效
- 支持多宠物