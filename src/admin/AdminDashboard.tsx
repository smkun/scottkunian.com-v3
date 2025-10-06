import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../lib/auth';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';
import { PostsManager } from './PostsManager';
import { NotesManager } from './NotesManager';
import { ProjectsManager } from './ProjectsManager';
import { ArticlesManager } from './ArticlesManager';
import { getProjects, getNotes, getArticles } from '../lib/firestore';

export function AdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      // User will be redirected by the auth state change
      console.log('Logout successful');
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      current: location.pathname === '/admin' || location.pathname === '/admin/'
    },
    {
      name: 'Projects',
      href: '/admin/projects',
      current: location.pathname.startsWith('/admin/projects')
    },
    {
      name: 'Nybles',
      href: '/admin/notes',
      current: location.pathname.startsWith('/admin/notes')
    },
    {
      name: 'Field Notes',
      href: '/admin/articles',
      current: location.pathname.startsWith('/admin/articles')
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      current: location.pathname.startsWith('/admin/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-muted border-r border-border">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  item.current
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary-100'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user?.displayName?.[0] || user?.email?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.displayName || 'Admin User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="small" asChild className="flex-1">
              <Link to="/">View Site</Link>
            </Button>
            <Button variant="ghost" size="small" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="py-8 px-8">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/posts/*" element={<PostsManager />} />
            <Route path="/projects/*" element={<ProjectsManager />} />
            <Route path="/notes/*" element={<NotesManager />} />
            <Route path="/articles/*" element={<ArticlesManager />} />
            <Route path="/settings" element={<div>Settings coming soon...</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AdminHome() {
  const [counts, setCounts] = useState({
    projects: 0,
    nybles: 0,
    fieldNotes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const [projects, notes, articles] = await Promise.all([
        getProjects(false), // Get all projects (not just public)
        getNotes(false),    // Get all nybles
        getArticles(false)  // Get all field notes
      ]);

      setCounts({
        projects: projects.length,
        nybles: notes.length,
        fieldNotes: articles.length
      });
    } catch (error) {
      console.error('Error loading counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Manage Projects',
      description: 'Add and update portfolio projects',
      href: '/admin/projects',
      status: 'Active'
    },
    {
      title: 'Add Nyble',
      description: 'Share a quick thought or story',
      href: '/admin/notes/new',
      status: 'Active'
    },
    {
      title: 'Manage Field Notes',
      description: 'Manage LinkedIn articles and field notes',
      href: '/admin/articles',
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : counts.projects}
            </div>
            <p className="text-xs text-muted-foreground">Live and ready</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nybles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : counts.nybles}
            </div>
            <p className="text-xs text-muted-foreground">Quick thoughts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Field Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : counts.fieldNotes}
            </div>
            <p className="text-xs text-muted-foreground">LinkedIn articles</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-medium transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{action.status}</Badge>
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={action.status === 'Coming Soon'}
                  asChild={action.status !== 'Coming Soon'}
                >
                  {action.status === 'Coming Soon' ? (
                    <span>Coming Soon</span>
                  ) : (
                    <Link to={action.href}>Manage</Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Firebase Status Section */}
      <Card>
        <CardHeader>
          <CardTitle>Firebase Status</CardTitle>
          <CardDescription>
            Your Firebase services are connected and operational
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="accent">✅ Authentication</Badge>
              <span className="text-sm text-muted-foreground">You are signed in and authorized</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="accent">✅ Firestore</Badge>
              <span className="text-sm text-muted-foreground">
                Database connected ({counts.projects + counts.nybles + counts.fieldNotes} documents)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">⚠️ Storage</Badge>
              <span className="text-sm text-muted-foreground">Requires Blaze plan for file uploads</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}