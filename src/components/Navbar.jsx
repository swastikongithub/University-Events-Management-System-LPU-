import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutGrid,
  CalendarPlus,
  Settings,
  LogOut,
  LogIn,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const { user, role, isTeacher, signOut, isDemo } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutGrid },
    ...(isTeacher
      ? [
          { to: '/reserve', label: 'Reserve', icon: CalendarPlus },
          { to: '/admin', label: 'Admin', icon: Settings },
        ]
      : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-lpu-orange flex items-center justify-center text-white font-bold text-sm">
              CF
            </div>
            <span className="text-base font-bold text-text-primary tracking-tight group-hover:text-lpu-orange transition-colors">
              ClassFinder
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 ${
                  isActive(to)
                    ? 'bg-lpu-orange-light text-lpu-orange'
                    : 'text-text-secondary hover:text-text-primary hover:bg-slate-light'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-xs">
                  {isTeacher ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-lpu-orange-light text-lpu-orange font-semibold">
                      <ShieldCheck size={12} />
                      Teacher
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-light text-green-status font-semibold">
                      <GraduationCap size={12} />
                      Student
                    </span>
                  )}
                  {isDemo && (
                    <span className="text-text-muted text-[10px]">(Demo)</span>
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg hover:bg-red-light text-text-muted hover:text-red-status transition-colors"
                  title="Sign out"
                  id="sign-out-btn"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-sm inline-flex items-center gap-2"
                id="login-link"
              >
                <LogIn size={14} />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
