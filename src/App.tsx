import { useState } from 'react';
import type { GameSession, RegionFilter } from './types';
import { I18nProvider, useI18n } from './i18n';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { GameBoard } from './components/Game/GameBoard';
import { FlagLibrary } from './components/FlagLibrary/FlagLibrary';

/**
 * App 根组件，负责路由与游戏启动/结束的顶层状态管理
 */
function AppContent() {
  const [currentGame, setCurrentGame] = useState<{
    mode: GameSession['mode'];
    difficulty: GameSession['difficulty'];
    continent: RegionFilter;
  } | null>(null);
  const [showFlagLibrary, setShowFlagLibrary] = useState(false);

  useI18n();

  const handleStartGame = (mode: GameSession['mode'], difficulty: GameSession['difficulty'], continent: RegionFilter = 'World') => {
    setCurrentGame({ mode, difficulty, continent });
  };

  const handleGameEnd = (session: GameSession) => {
    console.log('Game ended:', session);
    // Here you could save the score, show leaderboard, etc.
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
  };

  return (
    <div className="min-h-screen relative">
      <Header 
        onShowFlagLibrary={() => setShowFlagLibrary(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {currentGame ? (
          <GameBoard
            mode={currentGame.mode}
            difficulty={currentGame.difficulty}
            continent={currentGame.continent}
            onGameEnd={handleGameEnd}
            onBackToMenu={handleBackToMenu}
          />
        ) : (
          <div>
            <div className="text-center mb-8">
              {/* 主页面标题文字已删除 */}
            </div>
            <Navigation onStartGame={handleStartGame} />
          </div>
        )}
      </main>
      
      
      {/* Flag Library Modal */}
      <FlagLibrary 
        isOpen={showFlagLibrary}
        onClose={() => setShowFlagLibrary(false)}
      />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App
