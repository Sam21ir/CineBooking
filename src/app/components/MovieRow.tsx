import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../../store/slices/moviesSlice';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = 800;
      const newScrollLeft = rowRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      rowRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Update arrow visibility
      setTimeout(() => {
        if (rowRef.current) {
          setShowLeftArrow(rowRef.current.scrollLeft > 0);
          setShowRightArrow(
            rowRef.current.scrollLeft < rowRef.current.scrollWidth - rowRef.current.clientWidth - 10
          );
        }
      }, 300);
    }
  };
  
  return (
    <div className="space-y-4 px-8 md:px-16 mb-12">
      <h2 className="text-white text-2xl font-semibold">{title}</h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/70 transition opacity-0 group-hover:opacity-100 flex items-center justify-center"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}
        
        {/* Movies Container */}
        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
        
        {/* Right Arrow */}
        {showRightArrow && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/70 transition opacity-0 group-hover:opacity-100 flex items-center justify-center"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
