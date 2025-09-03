import { useState } from 'react';
import type { GameSession, RegionFilter } from './types';
import { I18nProvider, useI18n } from './i18n';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { GameBoard } from './components/Game/GameBoard';
import { Leaderboard } from './components/Leaderboard/Leaderboard';

/**
 * App 根组件，负责路由与游戏启动/结束的顶层状态管理
 */
function AppContent() {
  const [currentGame, setCurrentGame] = useState<{
    mode: GameSession['mode'];
    difficulty: GameSession['difficulty'];
    continent: RegionFilter;
  } | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const { t } = useI18n();

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
    <div className="min-h-screen relative" style={{ zIndex: 2 }}>
      <Header onShowLeaderboard={() => setShowLeaderboard(true)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentGame ? (
          <div>
            <div className="mb-4">
              <button
                onClick={handleBackToMenu}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('app.backToMenu')}
              </button>
            </div>
            <GameBoard
              mode={currentGame.mode}
              difficulty={currentGame.difficulty}
              continent={currentGame.continent}
              onGameEnd={handleGameEnd}
            />
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {t('app.welcome')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('app.subtitle')}
              </p>
            </div>
            <Navigation onStartGame={handleStartGame} />
          </div>
        )}
      </main>
      
      {/* Leaderboard Modal */}
      <Leaderboard 
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
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
