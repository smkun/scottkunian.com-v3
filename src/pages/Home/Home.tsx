import { useState, useEffect } from 'react';

const headshots = [
  '/images/ScottHeadshot.webp',
  '/images/ScottHeadshot2.webp',
  '/images/ScottHeadshot3.webp',
  '/images/ScottHeadshot4.webp',
];

export function Home() {
  const [currentHeadshotIndex, setCurrentHeadshotIndex] = useState<number>(() => {
    const saved = localStorage.getItem('currentHeadshotIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  const rotateHeadshot = () => {
    setCurrentHeadshotIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % headshots.length;
      localStorage.setItem('currentHeadshotIndex', newIndex.toString());
      return newIndex;
    });
  };

  useEffect(() => {
    // Listen for theme/effect changes to rotate headshot
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preferredTheme' || e.key === 'preferredEffect') {
        rotateHeadshot();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event from same page
    const handleThemeChange = () => {
      rotateHeadshot();
    };

    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('effectChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('effectChange', handleThemeChange);
    };
  }, []);

  return (
    <div className="h-full flex items-center justify-center py-4 px-4">
      <div
        className="hero-section text-center px-8 py-8 w-full max-w-6xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-md animate-gradient-shift rounded-3xl shadow-2xl"
        style={{ backgroundSize: '400% 400%' }}
      >
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 pb-2 leading-normal bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl">
            Leveling Up in Tech & Life
          </h1>
          <div className="text-xl md:text-2xl text-foreground/90 mb-2 font-semibold">
            Scott Kunian
          </div>
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            IT Professional | Senior Systems Engineer | Full-Stack Developer
          </p>

          {/* Headshot with Advanced Styling */}
          <div className="relative inline-block group mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
            <img
              src={headshots[currentHeadshotIndex]}
              alt="Scott Kunian"
              className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full object-cover border-4 border-primary/50 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-accent hover:shadow-primary/50"
            />
          </div>

          {/* Quick About Section - Inline */}
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-primary/20">
              <h3 className="text-base font-bold text-primary mb-1">30+ Years Experience</h3>
              <p className="text-foreground/80 text-xs">From Systems Administrator to Senior Engineer, solving complex IT challenges.</p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-accent/20 hover:border-accent/40 transition-all duration-500 hover:scale-105 hover:shadow-accent/20">
              <h3 className="text-base font-bold text-accent mb-1">Lifelong Gamer</h3>
              <p className="text-foreground/80 text-xs">D&D since 1977, 6 3D printers, and co-owner of Midgard Hobbies & Games.</p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-secondary/20 hover:border-secondary/40 transition-all duration-500 hover:scale-105 hover:shadow-secondary/20">
              <h3 className="text-base font-bold text-secondary-400 mb-1">IT Operations Builder</h3>
              <p className="text-foreground/80 text-xs">Clean builds, clear docs, stable services across sites.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
