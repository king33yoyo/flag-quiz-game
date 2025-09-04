# 国旗问答游戏 / Flag Quiz Game

一个互动式的国旗识别游戏，支持中文和英文双语。测试你对世界各国国旗的了解程度！

## 功能特点 / Features

- 🌍 **197个国家和地区** - 覆盖全球所有主要国家
- 🎮 **多种游戏模式** - 包括国旗识别、国家选择、限时挑战和生存模式
- 🗺️ **大洲筛选** - 可以选择特定大洲进行练习
- 🏆 **排行榜系统** - 记录生存模式和限时挑战的前10名成绩，支持玩家命名
- 🎯 **智能防重复** - 避免短时间内出现重复的国旗
- 🏳️ **特殊国旗支持** - 包括尼泊尔等非矩形国旗的正确显示和优化缩放
- 🌐 **双语支持** - 中文和英文界面切换
- 📱 **响应式设计** - 支持手机、平板和桌面设备
- 🎨 **地理主题背景** - 使用CSS创建的世界地图风格背景效果
- 🛡️ **错误边界** - 优雅的错误处理，防止游戏崩溃
- 💾 **本地存储** - 排行榜数据持久化保存
- ⏱️ **实时倒计时** - 限时挑战模式完整的倒计时功能
- 🔊 **音效反馈** - 答题正确/错误和倒计时音效
- 🎨 **优雅UI** - 改进的分数显示布局和标志展示效果

## 游戏模式 / Game Modes

### 1. 国旗识别 / Flag Identification
- 显示国旗，选择对应的国家
- 最经典的国旗学习模式

### 2. 国家选择 / Country Selection  
- 显示国家名称，选择对应的国旗
- 反向测试模式

### 3. 限时挑战 / Timed Challenge
- 60秒内回答尽可能多的问题
- 实时倒计时显示，最后5秒有音效提醒
- 时间结束自动结束游戏，高分可进入排行榜
- 挑战你的反应速度和知识储备

### 4. 生存模式 / Survival Mode
- 连续答题，直到答错为止
- 测试你的极限准确率
- 高分可进入排行榜，记录你的成就！

## 技术栈 / Tech Stack

- **前端框架**: React 19.1.1 + TypeScript
- **构建工具**: Vite 7.1.2
- **样式**: Tailwind CSS 4.1.12
- **语言**: 中文、英文
- **国旗图片**: PNG格式 + SVG emoji支持

## 开始使用 / Getting Started

### 环境要求 / Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装和运行 / Installation & Running

1. 克隆项目 / Clone the repository
```bash
git clone https://github.com/king33yoyo/flag-quiz-game.git
cd flag-quiz-game
```

2. 安装依赖 / Install dependencies
```bash
npm install
```

3. 启动开发服务器 / Start development server
```bash
npm run dev
```

4. 构建生产版本 / Build for production
```bash
npm run build
```

5. 预览生产版本 / Preview production build
```bash
npm run preview
```

## 项目结构 / Project Structure

```
src/
├── components/          # React组件
│   ├── Game/           # 游戏相关组件
│   │   ├── GameBoard.tsx      # 游戏主面板
│   │   ├── QuestionCard.tsx   # 问题卡片
│   │   ├── CountrySelectCard.tsx  # 国家选择卡片
│   │   ├── ScoreDisplay.tsx    # 分数显示
│   │   ├── Timer.tsx          # 计时器
│   │   └── GameOverContent.tsx # 游戏结束内容
│   ├── Layout/         # 布局组件
│   │   ├── Header.tsx         # 页面头部
│   │   └── Navigation.tsx     # 导航菜单
│   ├── Leaderboard/     # 排行榜组件
│   │   └── Leaderboard.tsx    # 排行榜界面
│   └── UI/             # 通用UI组件
│       ├── Button.tsx         # 按钮组件
│       ├── Modal.tsx          # 模态框
│       ├── FlagDisplay.tsx    # 国旗显示组件
│       └── ErrorBoundary.tsx  # 错误边界
├── data/               # 数据文件
│   └── countries.ts    # 国家数据
├── services/           # 服务层
│   ├── gameService.ts  # 游戏逻辑服务
│   ├── soundService.ts # 音效服务
│   └── storageService.ts # 存储服务
├── i18n/              # 国际化
│   ├── translations.ts # 翻译文件
│   ├── I18nContext.ts  # i18n上下文
│   ├── I18nProvider.tsx # i18n提供者
│   ├── useI18n.ts      # i18n钩子
│   ├── utils.ts        # 工具函数
│   └── index.ts        # i18n配置
├── types/              # TypeScript类型定义
│   └── index.ts
└── index.css           # 全局样式
```

## 游戏规则 / Game Rules

1. **选择游戏模式** - 从4种模式中选择一个
2. **选择大洲** - 可以选择全球或特定大洲
3. **开始游戏** - 系统会随机生成问题
4. **回答问题** - 点击正确的答案
5. **查看结果** - 系统会显示是否正确并更新分数
6. **游戏结束** - 根据模式不同，结束条件也不同
7. **保存成绩** - 生存模式的高分可以保存到排行榜

## 计分规则 / Scoring

- 基础分数：每题20分
- 连击奖励：连续答对额外获得5×连击数的分数
- 不同模式有特殊的计分规则

## 国旗数据 / Flag Data

- 包含197个国家和地区的国旗
- 每个国家包含：英文名、中文名、国旗图片、所属大洲、人口、面积等信息
- 特殊国旗（如尼泊尔）有专门的显示优化

## 贡献 / Contributing

欢迎提交Issue和Pull Request来改进这个项目！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

## 许可证 / License

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 致谢 / Acknowledgments

- 国旗数据来源于公开数据
- 感谢所有为国旗识别做出贡献的开发者
- 特别感谢React、Vite和Tailwind CSS团队

## 版本历史 / Version History

### v1.2.0 (2024-01-XX)
- ⏱️ **修复限时挑战模式** - 完整实现倒计时功能，自动结束游戏
- 🏆 **扩展排行榜系统** - 支持限时挑战模式高分记录
- 🎨 **优化分数显示** - 改进布局和间距，提升用户体验
- 🏳️ **增强国旗显示** - 优化特殊国旗（尼泊尔等）的缩放和显示效果
- 🔧 **完善错误处理** - 改进存储服务，只保存相关模式的分数
- 🎯 **修复导航问题** - 添加返回菜单按钮，改善游戏流程
- 🔊 **音效系统** - 完善倒计时音效反馈机制

### v1.1.0 (2024-01-XX)
- 🏆 新增排行榜系统，记录生存模式前10成绩
- 🎨 添加地理主题背景效果，提升视觉体验
- 🛡️ 实现错误边界，提高游戏稳定性
- 💾 排行榜数据本地存储，持久化保存
- 🔧 优化i18n架构，修复React 19快速刷新警告
- 🎯 修复计时器状态更新问题
- 📱 改进UI交互体验

### v1.0.0 (2024-01-XX)
- 初始版本发布
- 支持197个国家和地区的国旗
- 4种游戏模式
- 中英文双语支持
- 响应式设计

---

**开始测试你的国旗知识吧！/ Start testing your flag knowledge now!** 🎌
