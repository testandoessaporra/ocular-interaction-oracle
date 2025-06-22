import { useEffect, useRef } from 'react';
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';

interface ParticleEffectProps {
  x: number;
  y: number;
  color?: string;
  particleCount?: number;
  duration?: number;
  onComplete?: () => void;
}

const ParticleEffectOptimized = ({ 
  x, 
  y, 
  color = '#F59E0B', 
  particleCount = 20,
  duration = 1500,
  onComplete 
}: ParticleEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Se animações estão desabilitadas, não fazer nada
    if (!OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_PARTICLES) {
      onComplete?.();
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Ajustar canvas para tela toda
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Criar partículas
    const particles: any[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 2 + Math.random() * 3;
      
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        size: 3 + Math.random() * 3,
        opacity: 1
      });
    }
    
    let animationId: number;
    const startTime = Date.now();
    
    const animate = () => {
      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Atualizar e desenhar partículas
      let activeParticles = 0;
      
      particles.forEach(particle => {
        if (particle.life <= 0) return;
        
        // Atualizar posição
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravidade
        particle.vx *= 0.99; // resistência
        particle.life = 1 - progress;
        
        if (particle.life > 0) {
          activeParticles++;
          
          // Desenhar partícula
          ctx.save();
          ctx.globalAlpha = particle.life;
          ctx.fillStyle = color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = color;
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      });
      
      // Continuar animação ou finalizar
      if (activeParticles > 0 && progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [x, y, color, particleCount, duration, onComplete]);
  
  if (!OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_PARTICLES) {
    return null;
  }
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ParticleEffectOptimized;