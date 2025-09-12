export const translations = {
  en: {
    // App
    app: {
      title: "Flag Quiz Game",
      welcome: "Welcome to Flag Quiz Game!",
      subtitle: "Test your knowledge of world flags",
      backToMenu: "← Back to Menu"
    },
    
    // Game modes
    gameModes: {
      flagIdentify: {
        title: "Flag Identification",
        description: "Identify the country from its flag"
      },
      countrySelect: {
        title: "Country Selection", 
        description: "Choose the correct flag for a country"
      },
      timed: {
        title: "Timed Challenge",
        description: "Answer as many as you can in 60 seconds"
      },
      challenge: {
        title: "Challenge Mode",
        description: "Answer all countries in selected region without mistakes"
      }
    },
    
    // Difficulty levels
    difficulty: {
      easy: "Easy",
      medium: "Medium", 
      hard: "Hard",
      expert: "Expert"
    },
    
    // Game
    game: {
      start: "Start Game",
      endGame: "End Game",
      playAgain: "Play Again",
      timeRemaining: "Time Remaining",
      whichCountry: "Which country does this flag belong to?",
      whichCountryFlag: "Which flag belongs to {country}?",
      correct: "✓ Correct! This is {country}",
      wrong: "✗ Wrong! The correct answer is {country}"
    },
    
    // Stats
    stats: {
      score: "Score",
      correct: "Correct",
      accuracy: "Accuracy",
      streak: "Streak",
      finalScore: "Final Score"
    },
    
    // Header
    header: {
      leaderboard: "Leaderboard",
      flagLibrary: "Flag Library",
      profile: "Profile"
    },
    
    // Continent
    continent: {
      select: "Select Region:",
      world: "World",
      africa: "Africa",
      asia: "Asia",
      europe: "Europe",
      "north america": "North America",
      "south america": "South America",
      oceania: "Oceania",
      antarctica: "Antarctica"
    },
    
    // Game Over
    gameOver: {
      title: "Game Over!",
      challengeSuccess: "Challenge Complete! 🎉",
      challengeSuccessDesc: "You've mastered all countries in {region}!",
      perfectScore: "Perfect Score!",
      countriesCompleted: "Countries Completed: {completed}/{total}"
    },

    // Flag Library
    flagLibrary: {
      title: "Flag Library",
      searchPlaceholder: "Search countries by name or capital...",
      toggleNames: "Show/Hide Names",
      stats: "Showing {displayed} of {total} countries in {continent}",
      tip: "💡 Tip: Click on any flag to view detailed information",
      noSearchResults: "No countries found matching your search",
      noCountries: "No countries available for this region"
    },

    // Country Detail
    countryDetail: {
      basicInfo: "Basic Information",
      statistics: "Statistics",
      additionalInfo: "Additional Information",
      location: "Location",
      neighbours: "Neighboring Countries",
      capital: "Capital",
      continent: "Continent",
      subregion: "Subregion",
      difficulty: "Difficulty",
      population: "Population",
      area: "Area",
      landlocked: "Landlocked",
      independent: "Independent",
      languages: "Languages",
      currency: "Currency",
      coordinates: "Coordinates",
      neighbouringCountries: "neighboring countries"
    },

    // Common
    common: {
      close: "Close"
    }
  },
  
  zh: {
    // App
    app: {
      title: "国旗问答游戏",
      welcome: "欢迎来到国旗问答游戏！",
      subtitle: "测试你对世界国旗的了解",
      backToMenu: "← 返回菜单"
    },
    
    // Game modes
    gameModes: {
      flagIdentify: {
        title: "国旗识别",
        description: "根据国旗识别国家"
      },
      countrySelect: {
        title: "国家选择",
        description: "为国家选择正确的国旗"
      },
      timed: {
        title: "限时挑战",
        description: "在60秒内回答尽可能多的问题"
      },
      challenge: {
        title: "挑战模式",
        description: "答对选定地区的所有国家，一题不错"
      }
    },
    
    // Difficulty levels
    difficulty: {
      easy: "简单",
      medium: "中等",
      hard: "困难", 
      expert: "专家"
    },
    
    // Game
    game: {
      start: "开始游戏",
      endGame: "结束游戏",
      playAgain: "再玩一次",
      timeRemaining: "剩余时间",
      whichCountry: "这面国旗属于哪个国家？",
      whichCountryFlag: "{country}的国旗是哪一面？",
      correct: "✓ 正确！这是{country}",
      wrong: "✗ 错误！正确答案是{country}"
    },
    
    // Stats
    stats: {
      score: "得分",
      correct: "正确",
      accuracy: "准确率",
      streak: "连击",
      finalScore: "最终得分"
    },
    
    // Header
    header: {
      leaderboard: "排行榜",
      flagLibrary: "国旗库",
      profile: "个人资料"
    },
    
    // Continent
    continent: {
      select: "选择地区：",
      world: "全球",
      africa: "非洲",
      asia: "亚洲",
      europe: "欧洲",
      "north america": "北美洲",
      "south america": "南美洲",
      oceania: "大洋洲",
      antarctica: "南极洲"
    },
    
    // Game Over
    gameOver: {
      title: "游戏结束！",
      challengeSuccess: "挑战完成！🎉",
      challengeSuccessDesc: "你已经掌握了{region}的所有国家！",
      perfectScore: "完美得分！",
      countriesCompleted: "完成国家: {completed}/{total}"
    },

    // Flag Library
    flagLibrary: {
      title: "国旗库",
      searchPlaceholder: "搜索国家名称或首都...",
      toggleNames: "显示/隐藏名称",
      stats: "显示{continent}的{displayed}/{total}个国家",
      tip: "",
      noSearchResults: "未找到匹配的国家",
      noCountries: "该地区暂无国家"
    },

    // Country Detail
    countryDetail: {
      basicInfo: "基本信息",
      statistics: "统计数据",
      additionalInfo: "额外信息",
      location: "地理位置",
      neighbours: "邻国",
      capital: "首都",
      continent: "大洲",
      subregion: "子区域",
      difficulty: "难度",
      population: "人口",
      area: "面积",
      landlocked: "内陆国",
      independent: "主权国家",
      languages: "官方语言",
      currency: "货币",
      coordinates: "坐标",
      neighbouringCountries: "个邻国"
    },

    // Common
    common: {
      close: "关闭"
    }
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = string; // Allow any string key for nested translations