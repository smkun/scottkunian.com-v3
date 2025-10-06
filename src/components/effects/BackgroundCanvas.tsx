import { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  effect: 'matrix' | 'particles' | 'waves';
  theme?: string;
}

export function BackgroundCanvas({ effect, theme = 'purple' }: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let intervalId: number | undefined;

    // Get theme color for effects
    const getEffectColor = () => {
      const themeColors: Record<string, string> = {
        purple: '#9d4edd',
        green: '#10b981',
        red: '#ef4444',
        blue: '#3b82f6',
        light: '#6b7280',
      };
      return themeColors[theme] || '#9d4edd';
    };

    // Matrix Effect
    const loadMatrixEffect = () => {
      const letters = 'アァカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const fontSize = 16;
      const columns = Math.floor(canvas.width / fontSize);
      const drops: number[] = Array(columns).fill(1);

      const drawMatrix = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getEffectColor();
        ctx.font = `${fontSize}px monospace`;

        drops.forEach((y, index) => {
          const text = letters.charAt(Math.floor(Math.random() * letters.length));
          const x = index * fontSize;
          ctx.fillText(text, x, y * fontSize);

          if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[index] = 0;
          } else {
            drops[index] = y + 1;
          }
        });
      };

      intervalId = window.setInterval(drawMatrix, 50);
    };

    // Particles Effect
    const loadParticlesEffect = () => {
      interface Particle {
        x: number;
        y: number;
        size: number;
        dx: number;
        dy: number;
      }

      const particles: Particle[] = Array(300)
        .fill(null)
        .map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 1,
          dx: Math.random() * 4 - 2,
          dy: Math.random() * 4 - 2,
        }));

      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };

      window.addEventListener('mousemove', handleMouseMove);

      const drawParticles = () => {
        ctx.fillStyle = 'rgba(18, 18, 18, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          // Mouse repel logic
          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 100;

          if (distance < repelRadius) {
            const angle = Math.atan2(dy, dx);
            const force = (repelRadius - distance) / repelRadius;
            particle.dx -= Math.cos(angle) * force * 2;
            particle.dy -= Math.sin(angle) * force * 2;
          }

          // Update position
          particle.x += particle.dx;
          particle.y += particle.dy;

          // Bounce off walls
          if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

          // Apply friction
          particle.dx *= 0.98;
          particle.dy *= 0.98;

          // Draw particle
          ctx.fillStyle = getEffectColor();
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });

        animationId = requestAnimationFrame(drawParticles);
      };

      drawParticles();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    };

    // Waves Effect
    const loadWavesEffect = () => {
      interface Wave {
        amplitude: number;
        frequency: number;
        speed: number;
        y: number;
        offset: number;
      }

      const waves: Wave[] = [
        { amplitude: 40, frequency: 0.005, speed: 1, y: canvas.height * 0.2, offset: 0 },
        { amplitude: 30, frequency: 0.007, speed: 0.8, y: canvas.height * 0.4, offset: 0 },
        { amplitude: 50, frequency: 0.003, speed: 1.2, y: canvas.height * 0.6, offset: 0 },
        { amplitude: 35, frequency: 0.006, speed: 0.9, y: canvas.height * 0.8, offset: 0 },
      ];

      const drawWaves = () => {
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        waves.forEach((wave, index) => {
          ctx.beginPath();
          ctx.moveTo(0, wave.y);

          for (let x = 0; x < canvas.width; x++) {
            const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
            ctx.lineTo(x, y);
          }

          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.closePath();

          const color = getEffectColor();
          const opacity = 0.1 + index * 0.05;
          ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
          ctx.fill();

          wave.offset += wave.speed * 0.02;
        });

        animationId = requestAnimationFrame(drawWaves);
      };

      drawWaves();
    };

    // Load appropriate effect
    let cleanup: (() => void) | undefined;

    if (effect === 'matrix') {
      loadMatrixEffect();
    } else if (effect === 'particles') {
      cleanup = loadParticlesEffect();
    } else if (effect === 'waves') {
      loadWavesEffect();
    }

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (intervalId) clearInterval(intervalId);
      if (animationId) cancelAnimationFrame(animationId);
      if (cleanup) cleanup();
    };
  }, [effect, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
