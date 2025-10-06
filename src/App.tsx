import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AdminRoute } from './components/auth/ProtectedRoute';
import { SkipNav } from './components/accessibility/SkipNav';
import { initAnalytics, initWebVitals } from './lib/analytics';
import { BackgroundCanvas } from './components/effects/BackgroundCanvas';
import { CustomCursor } from './components/effects/CustomCursor';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About/About').then(m => ({ default: m.About })));
const Projects = lazy(() => import('./pages/Projects/Projects').then(m => ({ default: m.Projects })));
const Nybles = lazy(() => import('./pages/Nybles/Nybles').then(m => ({ default: m.Nybles })));
const FieldNotes = lazy(() => import('./pages/FieldNotes/FieldNotes').then(m => ({ default: m.FieldNotes })));
const Blog = lazy(() => import('./pages/Blog/Blog').then(m => ({ default: m.Blog })));
const Articles = lazy(() => import('./pages/Articles/Articles').then(m => ({ default: m.Articles })));
const Contact = lazy(() => import('./pages/Contact/Contact').then(m => ({ default: m.Contact })));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLogin = lazy(() => import('./pages/admin/Login').then(m => ({ default: m.AdminLogin })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('preferredTheme') || 'purple';
  });

  const [effect, setEffect] = useState<string>(() => {
    return localStorage.getItem('preferredEffect') || 'matrix';
  });

  useEffect(() => {
    // Initialize Google Analytics 4
    initAnalytics();
    // Initialize Web Vitals tracking
    initWebVitals();
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredTheme', theme);
    document.body.setAttribute('data-theme', theme);
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('preferredEffect', effect);
    window.dispatchEvent(new CustomEvent('effectChange', { detail: { effect } }));
  }, [effect]);

  return (
    <Router>
      <SkipNav />
      <BackgroundCanvas effect={effect as 'matrix' | 'particles' | 'waves'} theme={theme} />
      <CustomCursor theme={theme} />
      <div className="min-h-screen flex flex-col">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes with header/footer */}
            <Route path="/*" element={
              <>
                <Header
                  onThemeChange={setTheme}
                  onEffectChange={setEffect}
                  currentTheme={theme}
                  currentEffect={effect}
                />
                <main id="main-content" className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/nybles" element={<Nybles />} />
                      <Route path="/field-notes" element={<FieldNotes />} />
                      <Route path="/blog/*" element={<Blog />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/contact" element={<Contact />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </>
            } />

            {/* Admin login route (no header/footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;