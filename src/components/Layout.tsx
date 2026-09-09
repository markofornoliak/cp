import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Code2, FolderKanban, BarChart3, Settings, Home as HomeIcon } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon, exact: true },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: Code2 },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/progress', label: 'Progress', icon: BarChart3 },
];

export function Layout() {
  const location = useLocation();
  const { progress } = useProgress();

  // Don't show layout on welcome page
  if (location.pathname === '/welcome') {
    return <Outlet />;
  }

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="header-left">
          <a href="#/" className="logo">
            <div className="logo-mark">C++</div>
            <span>Learn C++</span>
          </a>
          <nav className="nav-desktop" aria-label="Primary">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="row row-3">
          <div className="text-small text-tertiary" style={{ display: 'none' }}>
            {/* Could show progress summary */}
          </div>
          <NavLink to="/settings" className={({ isActive }) => `btn btn-ghost btn-sm ${isActive ? 'active' : ''}`} aria-label="Settings">
            <Settings size={18} />
          </NavLink>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar" aria-label="Sidebar">
          <div>
            <div className="sidebar-section-title">Navigation</div>
            <div className="stack stack-2">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div>
            <div className="sidebar-section-title">Your Progress</div>
            <div className="card" style={{ padding: '14px' }}>
              <div className="stack stack-3">
                <div className="row row-between">
                  <span className="text-small text-secondary">Lessons</span>
                  <span className="text-small" style={{ fontWeight: 600 }}>{progress.completedLessons.length}</span>
                </div>
                <div className="row row-between">
                  <span className="text-small text-secondary">Exercises</span>
                  <span className="text-small" style={{ fontWeight: 600 }}>{progress.completedExercises.length}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, (progress.completedLessons.length / 38) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Settings size={18} />
              Settings
            </NavLink>
          </div>
        </aside>

        <main className="content-area">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Mobile">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
