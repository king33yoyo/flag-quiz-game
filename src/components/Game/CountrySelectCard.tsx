import type { GameQuestion } from '../../types';
import { useI18n } from '../../i18n';
import { soundService } from '../../services/soundService';
import { FlagDisplay } from '../UI/FlagDisplay';

interface CountrySelectCardProps {
  question: GameQuestion;
  onAnswer: (countryId: string) => void;
  showResult?: boolean;
  selectedAnswer?: string;
  disabled?: boolean;
}

export const CountrySelectCard: React.FC<CountrySelectCardProps> = ({
  question,
  onAnswer,
  showResult = false,
  selectedAnswer,
  disabled = false,
}) => {
  const { tWithParams } = useI18n();
  const getOptionStyle = (countryId: string) => {
    if (!showResult) return '';
    
    if (countryId === question.correctAnswer) {
      return 'border-green-500 bg-green-100';
    }
    
    if (selectedAnswer === countryId && countryId !== question.correctAnswer) {
      return 'border-red-500 bg-red-100';
    }
    
    return '';
  };
  
  return (
    <div className="card p-6 question-card">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fadeIn">
          {tWithParams('game.whichCountryFlag', { country: question.country.nameZh || question.country.name })}
        </h2>
        <div className="text-xl text-gray-600 mb-4 animate-fadeIn">
          请选择正确的国旗
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {question.options.map((country, index) => (
          <div
            key={country.id}
            onClick={() => {
              if (!disabled) {
                soundService.playClick();
                onAnswer(country.id);
              }
            }}
            className={`
              option-card p-4 rounded-lg border-2 cursor-pointer transition-all
              hover:shadow-lg hover:scale-105 text-center
              ${getOptionStyle(country.id)}
              ${showResult && country.id === question.correctAnswer ? 'correct-answer' : ''}
              ${showResult && selectedAnswer === country.id && country.id !== question.correctAnswer ? 'wrong-answer' : ''}
              ${disabled ? 'cursor-not-allowed opacity-75' : 'border-gray-200 hover:border-gray-300'}
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <FlagDisplay 
              country={country}
              size="md"
              className="w-full"
            />
          </div>
        ))}
      </div>
      
      {showResult && selectedAnswer && (
        <div className={`mt-6 p-4 rounded-lg text-center font-medium animate-scaleIn ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {selectedAnswer === question.correctAnswer ? (
            <span>{tWithParams('game.correct', { country: question.country.nameZh || question.country.name })}</span>
          ) : (
            <span>{tWithParams('game.wrong', { country: question.country.nameZh || question.country.name })}</span>
          )}
        </div>
      )}
    </div>
  );
};