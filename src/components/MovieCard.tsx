
import { getImageUrl } from "@/lib/tmdbService";
import { Movie } from "@/types/movie";
import { Heart, Star } from "lucide-react";
import { useFavorites } from "@/providers/FavoritesProvider";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { formatYear } from "@/utils/formatDate";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export default function MovieCard({ movie, className }: MovieCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const favorite = isFavorite(movie.id);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };
  
  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-lg group relative h-full",
          className
        )}
      >
        <div className="aspect-[2/3] relative overflow-hidden">
          <div className={cn(
            "absolute inset-0 bg-muted/50",
            imageLoaded ? "opacity-0" : "opacity-100"
          )}/>
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className={cn(
              "object-cover w-full h-full transition-all group-hover:scale-105 duration-700",
              !imageLoaded && "blur-sm"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={cn(
                "w-5 h-5 transition-all", 
                favorite ? "fill-red-500 text-red-500" : "text-white"
              )}
            />
          </button>
        </div>
        
        <div className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-base truncate mr-2">
              {movie.title}
            </h3>
            {movie.release_date && (
              <span className="text-xs text-muted-foreground">
                {formatYear(movie.release_date)}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1 inline" />
            <span className="text-sm">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
