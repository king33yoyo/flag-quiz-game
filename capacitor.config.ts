import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flagquiz.game',
  appName: '国旗问答游戏',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // 在开发模式下可以启用这个
    // androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    mediaPlaybackRequiresUserAction: false,
    backgroundColor: '#2a5298',
    icon: 'resources/icon.png',
    iconBackgroundColor: '#2a5298',
    splash: 'resources/splash.png',
    splashBackgroundColor: '#2a5298',
    splashImmersive: true,
    fullscreen: true,
    hideNavigationOnFullscreen: true,
    overrideUserAgent: 'FlagQuizGame/1.0.0'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
