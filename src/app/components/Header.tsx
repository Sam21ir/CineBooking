import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, UserCircle } from 'lucide-react';
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

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <Link to="/">
              <h1 className="text-red-600 text-3xl font-bold">CineBooking</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                to="/"
                className={`transition ${
                  location.pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Accueil
              </Link>
              <Link
                to="/movies"
                className={`transition ${
                  location.pathname === '/movies' ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Films
              </Link>
              <Link
                to="/populaires"
                className={`transition ${
                  location.pathname === '/populaires' ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Populaires
              </Link>
              <Link
                to="/ma-liste"
                className={`transition ${
                  location.pathname === '/ma-liste' ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Ma Liste
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-white hover:text-gray-300 transition"
              title="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setNotificationsOpen(true)}
              className="text-white hover:text-gray-300 transition relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {isAuthenticated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white hover:text-gray-300 transition flex items-center gap-2">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="hidden md:inline text-sm">{currentUser.name}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-white">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <UserCircle className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-gray-300 transition flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline text-sm">Login</span>
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
