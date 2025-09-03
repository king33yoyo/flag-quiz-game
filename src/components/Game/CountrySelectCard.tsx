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
    <div className="card p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {tWithParams('game.whichCountryFlag', { country: question.country.nameZh || question.country.name })}
        </h2>
        <div className="text-lg text-gray-600 mb-4">
          请选择正确的国旗
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {question.options.map((country) => (
          <div
            key={country.id}
            onClick={() => {
              if (!disabled) {
                soundService.playClick();
                onAnswer(country.id);
              }
            }}
            className={`
              p-3 rounded-lg border-2 cursor-pointer transition-all
              hover:shadow-md hover:scale-105 text-center
              ${getOptionStyle(country.id)}
              ${disabled ? 'cursor-not-allowed opacity-75' : 'border-gray-200 hover:border-gray-300'}
            `}
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
        <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
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