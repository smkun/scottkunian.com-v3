import { useEffect, useState } from 'react';

interface CustomCursorProps {
  theme?: string;
}

export function CustomCursor({ theme = 'purple' }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getThemeColor = () => {
    const themeColors: Record<string, string> = {
      purple: '#9d4edd',
      green: '#10b981',
      red: '#ef4444',
      blue: '#3b82f6',
      light: '#6b7280',
    };
    return themeColors[theme] || '#9d4edd';
  };

  return (
    <div
      className="custom-cursor pointer-events-none fixed rounded-full mix-blend-screen -z-0"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        width: '30px',
        height: '30px',
        background: `radial-gradient(circle, ${getThemeColor()}88 0%, transparent 70%)`,
        transition: 'width 0.2s ease, height 0.2s ease',
      }}
      aria-hidden="true"
    />
  );
}
