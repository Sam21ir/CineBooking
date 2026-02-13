import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Edit2, Heart, Ticket, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProfile, logout } from '../store/slices/usersSlice';
import { fetchMovies } from '../store/slices/moviesSlice';
import { Header } from '../app/components/Header';
import { Footer } from '../app/components/Footer';
import { BookingHistory } from '../app/components/BookingHistory';
import { MovieCard } from '../app/components/MovieCard';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Card } from '../app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app/components/ui/tabs';

interface ProfileFormData {
  name: string;
  email: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, loading } = useAppSelector((state) => state.users);
  const { movies: favoriteMovies } = useAppSelector((state) => state.myList);
  const { movies: allMovies } = useAppSelector((state) => state.movies);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    // Load movies for favorites display
    if (allMovies.length === 0) {
      dispatch(fetchMovies());
    }
    // Reset form with current user data
    reset({
      name: currentUser.name,
      email: currentUser.email,
    });
  }, [currentUser, navigate, dispatch, allMovies.length, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!currentUser) return;

    try {
      await dispatch(updateProfile({
        id: currentUser.id,
        updates: {
          name: data.name,
          email: data.email,
        }
      })).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      <Header />
      <div className="container mx-auto px-4 py-12 pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-8 bg-gray-900 border-gray-800">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="bg-red-600/20 p-4 rounded-full">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-20 h-20 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{currentUser.name}</h1>
                  <p className="text-gray-400 mb-4">{currentUser.email}</p>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:border-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-gray-800"
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <Input
                        id="name"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                          }
                        })}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="bg-gray-800 border-gray-700 text-white mt-1"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Tabs for Bookings and Favorites */}
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="bg-gray-900 border-gray-800 mb-6">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <BookingHistory />
            </TabsContent>

            <TabsContent value="favorites">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">My Favorites</h2>
                {favoriteMovies.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-2">No favorites yet</p>
                    <p className="text-gray-500 text-sm mb-6">Add movies to your favorites list!</p>
                    <Button
                      onClick={() => navigate('/movies')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Browse Movies
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {favoriteMovies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}

