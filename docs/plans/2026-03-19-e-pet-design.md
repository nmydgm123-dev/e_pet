# e_pet 桌面宠物应用设计文档

## 概述
创建一个适用于 Mac 的电子宠物桌面应用，使用 Electron + Canvas 2D 实现透明悬浮窗效果。宠物是一只可爱的小动物，可以在桌面上自由走动，用户可以与它互动（抚摸、喂食）。

## 架构设计

### 系统架构
- **主进程 (main.js)**：创建透明悬浮窗，管理窗口生命周期
- **渲染进程 (renderer)**：使用 Canvas 2D 绘制宠物，处理用户交互
- **状态机**：控制宠物行为（走动、睡觉、玩耍、饥饿）
- **数据层**：本地存储宠物状态（使用 localStorage）

## 组件设计

### 1. Pet 类
管理宠物状态和动画的核心类：
- **属性**：`x`, `y`, `hunger`, `mood`, `state`（walking/sleeping/playing）
- **方法**：`update()`, `render()`, `feed()`, `pet()`

### 2. Canvas 渲染器
- 绘制宠物精灵（圆形/简单图形）
- 动画效果（眨眼、摇尾巴）
- 使用 `requestAnimationFrame` 优化性能

### 3. 交互处理器
- 点击事件（抚摸、喂食）
- 拖拽移动窗口

## 数据流

### 启动流程
```
main.js → 创建透明窗口 → 加载 index.html → 初始化 Canvas → 加载宠物状态
```

### 交互流程
```
用户点击 → 触发事件 → 更新宠物状态 → 重新渲染
```

### 状态保存
- 定时（每30秒）将宠物状态保存到 localStorage
- 启动时从 localStorage 恢复状态

## 错误处理

### 窗口管理
- 关闭所有窗口时退出应用
- macOS 上点击 Dock 图标时重新创建窗口

### 状态恢复
- 如果 localStorage 数据损坏，使用默认状态
- 控制台输出错误日志

### 性能优化
- 使用 `requestAnimationFrame` 优化渲染
- 空闲时降低帧率

## 文件结构
```
e_pet/
├── main.js          # Electron 主进程
├── index.html       # 主界面
├── renderer.js      # 渲染进程逻辑
├── pet.js           # Pet 类定义
├── style.css        # 样式
├── package.json     # 项目配置
└── docs/
    └── plans/
        └── 2026-03-19-e-pet-design.md  # 本设计文档
```

## 验证方式
- 手动测试：`npm start` 启动应用，验证宠物显示和交互
- 状态测试：验证 localStorage 保存和恢复功能
- 性能测试：监控 CPU 和内存使用情况

## 后续扩展（可选）
- 添加更多宠物种类
- 实现宠物成长系统
- 添加音效和背景音乐
- 支持多宠物同时显示