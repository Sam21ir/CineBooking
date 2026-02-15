import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { SearchModal } from './SearchModal';
import { NotificationsModal } from './NotificationsModal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMovies } from '../../store/slices/moviesSlice';
import { logout } from '../../store/slices/usersSlice';
import { loadUserFromStorage } from '../../store/slices/usersSlice';
import { loadUserNotifications } from '../../store/slices/notificationsSlice';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { movies } = useAppSelector((state) => state.movies);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.users);

  // Load user from localStorage on mount
  useEffect(() => {
    dispatch(loadUserFromStorage()).then(() => {
      // Load user-specific notifications after user is loaded
      dispatch(loadUserNotifications());
    });
  }, [dispatch]);
  
  // Reload notifications when user changes
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUserNotifications());
    }
  }, [dispatch, isAuthenticated, currentUser?.id]);

  // Fetch movies if not loaded when opening search
  useEffect(() => {
    if (searchOpen && movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [searchOpen, movies.length, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    // Clear notifications when logging out
    dispatch(loadUserNotifications()); // This will load empty notifications for no user
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/movies', label: 'Films' },
    { to: '/populaires', label: 'Populaires' },
    { to: '/ma-liste', label: 'Ma Liste' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 md:py-4">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 min-w-0 flex-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="group flex-shrink-0">
              <h1 className="text-red-600 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold transition-transform group-hover:scale-105 whitespace-nowrap">
                CineBooking
              </h1>
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative transition-all duration-200 ${
                    location.pathname === link.to 
                      ? 'text-white font-medium' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-white/60 rounded-full"></span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 lg:gap-6 flex-shrink-0">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button 
                  className="md:hidden text-white hover:text-gray-300 transition-all duration-200 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 active:scale-95 flex-shrink-0"
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-[280px] sm:w-[320px] bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-gray-800/50"
              >
                <div className="flex flex-col h-full">
                  {/* Header with logo */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800/50">
                    <h2 className="text-2xl font-bold text-white">Menu</h2>
                  </div>
                  
                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-2 flex-1">
                    {navLinks.map((link, index) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group relative px-4 py-3 rounded-lg transition-all duration-200 ${
                          location.pathname === link.to 
                            ? 'text-white bg-white/10 border-l-2 border-white/30' 
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          {link.label}
                          {location.pathname === link.to && (
                            <span className="ml-auto w-2 h-2 bg-white/60 rounded-full"></span>
                          )}
                        </span>
                        {location.pathname !== link.to && (
                          <span className="absolute left-0 top-0 bottom-0 w-0 bg-white/5 rounded-l-lg transition-all duration-200 group-hover:w-full"></span>
                        )}
                      </Link>
                    ))}
                  </nav>
                  
                  {/* Footer decoration */}
                  <div className="mt-auto pt-4 border-t border-gray-800/50">
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-white hover:text-gray-300 transition-all duration-200 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 active:scale-95 flex-shrink-0"
              title="Rechercher"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <button 
              onClick={() => setNotificationsOpen(true)}
              className="text-white hover:text-gray-300 transition-all duration-200 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 active:scale-95 relative flex-shrink-0"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-600 text-white text-[10px] sm:text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {isAuthenticated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white hover:text-gray-300 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 active:scale-95 flex-shrink-0">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full object-cover ring-2 ring-white/20 hover:ring-white/40 transition-all flex-shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/20 hover:ring-white/40 transition-all flex-shrink-0">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      </div>
                    )}
                    <span className="hidden xl:inline text-sm font-medium whitespace-nowrap">{currentUser.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#0a0a0a]/95 border-gray-800/50 text-white backdrop-blur-xl shadow-xl">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer hover:bg-white/5 focus:bg-white/5">
                      <UserCircle className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800/50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:bg-white/5 focus:text-white focus:bg-white/5"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-gray-300 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-white/5 active:scale-95 flex-shrink-0"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="hidden xl:inline text-sm font-medium whitespace-nowrap">Login</span>
              </Link>
            )}
          </div>
        </div>
      </header>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <NotificationsModal open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </>
  );
}
