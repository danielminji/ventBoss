import React from 'react';
import { Card } from '@/components/ui/card';

interface BossAvatarProps {
  imageUrl: string | null;
  expression: 'neutral' | 'shocked';
}

export const BossAvatar: React.FC<BossAvatarProps> = ({ imageUrl, expression }) => {
  const getExpressionStyle = () => {
    switch (expression) {
      case 'shocked':
        return {
          transform: 'scale(1.03)',
          borderColor: '#f97316', // Orange-500
          boxShadow: '0 0 20px rgba(249, 115, 22, 0.5)',
        };
      default:
        return {
          transform: 'scale(1)',
          borderColor: '#d1d5db', // Gray-300
        };
    }
  };

  const getExpressionEmoji = () => {
    switch (expression) {
      case 'shocked': return '😲';
      default: return '😐';
    }
  };

  const getExpressionText = () => {
    switch (expression) {
      case 'shocked': return "Shocked";
      default: return "Neutral";
    }
  };

  const style = getExpressionStyle();

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <h3 className="text-xl font-semibold mb-6">Boss Avatar</h3>
      
      <div className="relative">
        <div 
          className="w-64 h-64 mx-auto rounded-full border-4 overflow-hidden transition-all duration-300 ease-in-out"
          style={style}
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Boss Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-6xl">{getExpressionEmoji()}</span>
            </div>
          )}
        </div>
        
        <div className="absolute top-2 right-2 text-4xl bg-white/70 backdrop-blur-sm rounded-full p-1">
          {getExpressionEmoji()}
        </div>
      </div>
      
      <div className="mt-4 space-y-2 min-h-[3rem]">
        <div className="text-sm font-medium capitalize text-gray-700">
          Expression: {getExpressionText()}
        </div>
        {expression === 'shocked' && (
            <p className="text-xs text-gray-600 animate-pulse italic">
              "Whoa, okay... I'm hearing you."
            </p>
        )}
      </div>
    </Card>
  );
};
