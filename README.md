# 🎁 Gift Exchange - 礼物交换

一个有趣的朋友间礼物交换网页应用，支持随机匹配算法和多种视觉风格。

## 🎮 项目版本

本项目包含三个不同风格的版本：

### 1. 复古街机版 (推荐) 🎮
**文件**: `retro-gift-exchange.html`

1980年代街机游戏风格，包含：
- ✨ CRT屏幕特效（扫描线、闪烁、暗角）
- 🔊 8-bit音效系统（Web Audio API）
- 🥚 复活节彩蛋（特殊名字触发、Konami代码）
- 💾 localStorage数据持久化
- 📱 完全响应式设计

**特性**：
- 使用Google Fonts 'Press Start 2P'像素字体
- 霓虹绿色调配色方案
- 完整的游戏化界面（INSERT COIN、START GAME等）

### 2. 简约版 📝
**文件**: `simple-gift-exchange.html`

简洁现代风格，专注于核心功能：
- 添加/移除参与者
- 随机礼物匹配
- 毛玻璃效果卡片
- 浮动礼物盒装饰

### 3. 完整版 🎨
**文件**: `gift-exchange.html`

功能最丰富的版本，包含：
- 活动创建（名称、预算、日期）
- 参与者管理
- 随机匹配算法
- 礼物创意建议
- 彩色纸屑特效

## 🚀 快速开始

### 方法一：直接打开
在浏览器中打开任意HTML文件即可使用：
```bash
open retro-gift-exchange.html  # Mac
# 或双击文件在浏览器中打开
```

### 方法二：本地服务器
使用Python启动本地服务器：
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# 然后在浏览器访问 http://localhost:8000
```

## 🎯 使用方法

### 复古街机版使用说明：

1. **添加参与者**
   - 在输入框中输入朋友的名字
   - 点击 `INSERT COIN` 或按回车键添加
   - 可以添加任意数量的参与者

2. **开始匹配**
   - 至少添加2个人后
   - 点击 `START GAME` 开始随机匹配
   - 查看你的礼物对象是谁

3. **彩蛋发现** 🎊
   - 输入特殊名字：`KONAMI`、`EASTER`、`SECRET`、`CODE`
   - 连续点击礼物盒5次
   - 输入Konami代码：↑↑↓↓←→←→BA

4. **数据持久化**
   - 参与者列表自动保存到localStorage
   - 页面刷新后数据不丢失

## 🎨 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 动画、渐变、响应式布局
  - CSS Grid & Flexbox
  - CSS动画和过渡效果
  - CSS变量（自定义属性）
- **JavaScript (ES6+)** - 交互逻辑
  - 模块化代码结构
  - Web Audio API（音效）
  - localStorage API（数据持久化）
  - 随机匹配算法

## 📱 响应式支持

所有版本都支持：
- 📱 手机（320px+）
- 📱 平板（768px+）
- 💻 桌面（1024px+）

## 🎵 音效说明

复古版使用Web Audio API生成8-bit风格音效：
- 🪙 投币声 - 添加玩家
- 👆 按钮点击 - 界面交互
- 🎵 游戏开始 - 匹配前奏
- 🎉 匹配成功 - 胜利音效
- 🎊 彩蛋触发 - 特殊音效

*注意：首次交互需要用户授权音频播放*

## 🔒 隐私说明

- 所有数据仅保存在用户本地浏览器（localStorage）
- 不收集、不上传任何用户信息
- 无需注册或登录

## 📄 许可证

MIT License - 可自由使用、修改和分发

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系方式

如有问题或建议，请通过GitHub Issues联系。

---

**享受礼物交换的乐趣吧！** 🎁✨
