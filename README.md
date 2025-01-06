# VPS剩余价值计算器

一个优雅的VPS剩余价值计算工具，帮助您快速评估VPS的剩余价值。

## 特色功能

- 🌸 优雅的樱花渐变动态背景
- 💱 实时汇率转换 (支持 CNY/USD/EUR)
- 🎯 精确的剩余价值计算
- 📱 完美的移动端适配
- 🤖 可爱的看板娘助手（桌面端）
- ✨ 粒子特效背景
- 🎨 可调节界面透明度（桌面端）
- 📊 访问统计功能

## 一键部署

1. 首先获取免费的汇率API密钥：
   - 注册 [ExchangeRate-API](https://www.exchangerate-api.com)
   - 获取免费的 API 密钥

2. 运行一键部署命令：
```bash
rm -f vps_value_calculator_deploy.sh && curl -O https://raw.githubusercontent.com/lzyq0912/vps-calculator/main/vps_value_calculator_deploy.sh && chmod +x vps_value_calculator_deploy.sh && ./vps_value_calculator_deploy.sh
```

3. 根据提示输入你的 API 密钥

4. 访问 `http://你的服务器IP:20000` 即可使用

## 环境要求

- 支持 Docker 的 Linux 系统
- 开放 20000 端口
- 至少 512MB 内存

## 自定义指南

如果你想自定义网站样式或添加自己的链接，可以修改以下文件：

### 1. 样式自定义
- `frontend-new/assets/css/background.css`: 背景样式、面板样式
- `frontend-new/assets/css/custom.css`: 主要界面样式

### 2. 文字和链接自定义
- `frontend-new/index.html`: 主页面文字和结构
- 可在计算器上方或下方添加自定义链接和广告

### 3. 看板娘配置
- 在 `frontend-new/index.html` 中的 `live2d_settings` 部分可以自定义看板娘行为

### 4. 背景效果
- `frontend-new/assets/js/particles-config.js`: 粒子效果配置
- `frontend-new/assets/css/background.css`: 渐变背景颜色

## 问题反馈

如果你在使用过程中遇到任何问题，欢迎提交 Issue 或通过以下方式联系我：
[这里可以添加你的联系方式或社交媒体链接]
