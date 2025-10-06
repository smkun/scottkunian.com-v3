import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onThemeChange?: (theme: string) => void;
  onEffectChange?: (effect: string) => void;
  currentTheme?: string;
  currentEffect?: string;
}

export function Header({ onThemeChange, onEffectChange, currentTheme = 'purple', currentEffect = 'matrix' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Field Notes', href: '/articles' },
    { name: 'Projects', href: '/projects' },
    { name: 'Nybles', href: '/nybles' },
    { name: 'Get in Touch', href: '/contact' },
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/scott-kunian-8984302/',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      href: 'https://github.com/smkun',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/skunian/',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ];

  return (
    <header className="bg-gradient-to-r from-primary/20 via-accent/10 to-secondary/20 backdrop-blur-md sticky top-0 z-40 border-b border-primary/20 shadow-[0_4px_20px_rgba(168,85,247,0.3)]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center py-4">
          {/* Social Icons (Left) - matching OLD_SITE */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${link.name} Profile`}
                className="text-foreground hover:text-primary p-2 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/30 hover:via-accent/30 hover:to-secondary/30 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>

          {/* Desktop Navigation (Center) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  px-5 py-2 rounded-md text-sm font-medium transition-all duration-300
                  ${isActive(item.href)
                    ? 'bg-primary text-white pointer-events-none'
                    : 'text-muted-foreground hover:text-white hover:bg-secondary'
                  }
                `}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Theme and Effect Selectors + Admin (Right) */}
          <div className="hidden md:flex items-center gap-3">
            <select
              value={currentEffect}
              onChange={(e) => onEffectChange?.(e.target.value)}
              className="bg-muted text-foreground border border-border rounded-md px-3 py-1.5 text-sm transition-all duration-300 hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              title="Select Effect"
            >
              <option value="matrix">Matrix</option>
              <option value="particles">Particles</option>
              <option value="waves">Waves</option>
            </select>

            <select
              value={currentTheme}
              onChange={(e) => onThemeChange?.(e.target.value)}
              className="bg-muted text-foreground border border-border rounded-md px-3 py-1.5 text-sm transition-all duration-300 hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              title="Select Theme"
            >
              <option value="purple">Purple</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="light">Light</option>
            </select>

            {/* Admin Access */}
            <Link
              to="/admin"
              title="Admin Panel"
              className="p-2 rounded-full transition-all duration-300 hover:bg-white/10 hover:scale-110"
            >
              <svg
                className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="small"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="text-foreground hover:text-primary"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-2 mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    px-4 py-3 rounded-md text-sm font-medium transition-all duration-300
                    ${isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-white hover:bg-secondary'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Theme and Effect Selectors */}
            <div className="px-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Effect</label>
                <select
                  value={currentEffect}
                  onChange={(e) => onEffectChange?.(e.target.value)}
                  className="w-full bg-muted text-foreground border border-border rounded-md px-3 py-2 text-sm transition-all duration-300 hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="matrix">Matrix</option>
                  <option value="particles">Particles</option>
                  <option value="waves">Waves</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">Theme</label>
                <select
                  value={currentTheme}
                  onChange={(e) => onThemeChange?.(e.target.value)}
                  className="w-full bg-muted text-foreground border border-border rounded-md px-3 py-2 text-sm transition-all duration-300 hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="purple">Purple</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="light">Light</option>
                </select>
              </div>

              {/* Mobile Admin Access */}
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-white hover:bg-secondary transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
