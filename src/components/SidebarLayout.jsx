import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { LayoutDashboard, CalendarDays, CheckSquare, Settings, LogOut, LogIn, Clock, PlusCircle, Search, ChevronLeft, ChevronRight, Hourglass } from 'lucide-react';

export default function SidebarLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Initial load animation for navbar — slide down from top
    gsap.fromTo(navbarRef.current, {
      y: -60,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }, []);

  // Animate content on route change (runs on initial mount too)
  useGSAP(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define links based on role or guest status
  const getLinks = () => {
    // If not logged in, show the public event tabs
    if (!user) {
      return [
        { path: '/', label: 'All Events', icon: CalendarDays },
        { path: '/ongoing', label: 'Ongoing Events', icon: Clock },
        { path: '/upcoming', label: 'Upcoming Events', icon: Hourglass },
        { path: '/past', label: 'Past Events', icon: CheckSquare },
      ];
    }
    // Student role is being deprecated, but we'll keep the same public view just in case
    if (user.role === 'student') {
      return [
        { path: '/', label: 'All Events', icon: CalendarDays },
        { path: '/ongoing', label: 'Ongoing Events', icon: Clock },
        { path: '/upcoming', label: 'Upcoming Events', icon: Hourglass },
        { path: '/past', label: 'Past Events', icon: CheckSquare },
      ];
    }
    if (user.role === 'organizer') {
      return [
        { path: '/', label: 'All Events', icon: CalendarDays },
        { path: '/organizer', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/organizer/create', label: 'New Event', icon: PlusCircle },
      ];
    }
    if (user.role === 'teacher') {
      return [
        { path: '/', label: 'All Events', icon: CalendarDays },
        { path: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/teacher/pending', label: 'Pending Duty', icon: Clock },
      ];
    }
    return [];
  };

  const links = getLinks();

  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col h-screen bg-[#F5F6F8] overflow-hidden">
      
      {/* Top Header - Full Width */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-20 relative">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/3/3a/Lovely_Professional_University_logo.png" 
            alt="LPU Logo" 
            className="h-10 w-auto object-contain"
          />
          <span className="font-bold text-gray-800 text-lg hidden sm:block tracking-tight">University Events Management System</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Global Search Bar */}
          <div className="relative w-48 sm:w-64 hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ums-input py-1.5 text-sm h-[36px]"
              style={{ paddingLeft: '34px' }}
            />
          </div>

          <div className="header-user">
            {user && (
              <>
                <div className="header-user-info hidden sm:block">
                  <div className="header-user-name">{user.name}</div>
                  <div className="header-user-meta">{user.regNo} · {user.role.toUpperCase()}</div>
                </div>
                <div className="header-avatar">
                  {user.name.charAt(0)}
                </div>
                <button onClick={handleLogout} className="header-auth-btn" title="Logout">
                  <LogOut size={18} strokeWidth={2} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container below Header */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Vertical Collapsible Sidebar */}
        <aside 
          ref={navbarRef} 
          className={`${isExpanded ? 'w-[120px]' : 'w-0'} bg-[#FCA24E] flex flex-col shadow-lg z-10 shrink-0 relative transition-all duration-300 ease-in-out border-r border-orange-500`}
        >
          {/* Toggle Button */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-r-md w-[28px] h-[36px] flex items-center justify-center shadow-sm text-gray-800 hover:bg-white/70 z-40 transition-all duration-300 -right-[12px] hover:-right-[28px]"
          >
            {isExpanded ? <ChevronLeft size={20} strokeWidth={2.5} /> : <ChevronRight size={20} strokeWidth={2.5} />}
          </button>

          {/* Sidebar Links - hidden when collapsed */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
            <nav className="sidebar-nav pt-2">
              {links.map((link) => {
                const isActive = location.pathname === link.path || (location.pathname === '/' && link.path === '/student');
                const Icon = link.icon;
                return (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`sidebar-link flex-col justify-center gap-2 px-2 py-4 ${isActive ? 'active' : ''}`}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <Icon size={24} strokeWidth={1.5} className="shrink-0" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Scrollable Content Area */}
        <main ref={contentRef} className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-6xl mx-auto pb-12">
            <Outlet context={{ searchQuery, setSearchQuery }} />
          </div>
        </main>
      </div>
    </div>
  );
}
