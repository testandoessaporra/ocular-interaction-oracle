
import React, { useState, useEffect } from 'react';

interface UserAvatarProps {
  level: number;
}

const UserAvatar = ({ level }: UserAvatarProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Avatar evolution based on level with corresponding images
  const getAvatarData = (level: number) => {
    if (level >= 20) return { 
      stage: 'elite', 
      image: '/lovable-uploads/d4df7f7f-ae4e-4bd4-af68-0e6e7f2e7642.png',
      class: 'Delegado'
    };
    if (level >= 15) return { 
      stage: 'officer', 
      image: '/lovable-uploads/800e4239-7048-4ff7-96a3-e15aa899edc0.png',
      class: 'Inspetor'
    };
    if (level >= 10) return { 
      stage: 'cadet', 
      image: '/lovable-uploads/800e4239-7048-4ff7-96a3-e15aa899edc0.png',
      class: 'Veterano'
    };
    if (level >= 5) return { 
      stage: 'student', 
      image: '/lovable-uploads/2f9258a4-c8c3-45c7-a5e2-56bb78a3d645.png',
      class: 'Soldado'
    };
    return { 
      stage: 'beginner', 
      image: '/lovable-uploads/fc6f1347-6a5e-4d3e-8d84-f8d4c2a65cec.png',
      class: 'Recruta'
    };
  };

  const avatarData = getAvatarData(level);

  const avatarStyles = {
    beginner: 'bg-gradient-to-b from-gray-400 to-gray-600',
    student: 'bg-gradient-to-b from-blue-400 to-blue-600',
    cadet: 'bg-gradient-to-b from-green-400 to-green-600',
    officer: 'bg-gradient-to-b from-purple-400 to-purple-600',
    elite: 'bg-gradient-to-b from-yellow-400 to-orange-600'
  };

  // Preload images on component mount
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
    img.src = avatarData.image;
  }, [avatarData.image]);

  return (
    <div className="relative">
      <div 
        className={`
          w-24 h-32 rounded-xl ${avatarStyles[avatarData.stage]} 
          flex items-center justify-center shadow-lg transition-all duration-300 
          hover:scale-110 border-2 border-gray-600 p-2
        `}
        style={{
          boxShadow: `
            0 4px 8px rgba(0, 0, 0, 0.2),
            0 0 0 2px rgba(255, 212, 83, 0.25)
          `
        }}
      >
        {!imageLoaded && !imageError && (
          <div className="w-full h-full bg-gray-700 rounded-xl animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {imageError && (
          <div className="w-full h-full bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 text-xs">
            Avatar
          </div>
        )}
        
        {imageLoaded && (
          <img 
            src={avatarData.image} 
            alt={`Avatar ${avatarData.class}`}
            className="w-full h-full object-contain pixel-art rounded-xl"
            style={{ imageRendering: 'pixelated' }}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      
      {/* Level badge integrated with avatar */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-yellow-300">
        {level}
      </div>
      
      {/* Evolution glow effect for higher levels */}
      {level >= 10 && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 opacity-20 animate-pulse -z-10 scale-110"></div>
      )}
    </div>
  );
};

export default UserAvatar;
