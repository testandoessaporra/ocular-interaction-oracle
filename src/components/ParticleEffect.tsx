
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ParticleEffectProps {
  x: number;
  y: number;
  color?: string;
  particleCount?: number;
  duration?: number;
  onComplete?: () => void;
}

const ParticleEffect = ({ 
  x, 
  y, 
  color = '#F59E0B', 
  particleCount = 20,
  duration = 1500,
  onComplete 
}: ParticleEffectProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Criar partículas iniciais
    const initialParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 2 + Math.random() * 3;
      
      initialParticles.push({
        id: i,
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: duration,
        maxLife: duration,
        color: color,
        size: 3 + Math.random() * 3
      });
    }
    
    setParticles(initialParticles);

    // Animar partículas
    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // gravidade
          life: particle.life - 16, // assumindo ~60fps
          vx: particle.vx * 0.99 // resistência do ar
        })).filter(particle => particle.life > 0);

        if (updated.length === 0 && onComplete) {
          onComplete();
        }

        return updated;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [x, y, color, particleCount, duration, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife,
            boxShadow: `0 0 6px ${particle.color}`,
            transform: `scale(${particle.life / particle.maxLife})`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;
