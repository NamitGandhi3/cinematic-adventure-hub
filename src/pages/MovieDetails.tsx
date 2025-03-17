
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchMovieDetails, getImageUrl, BACKDROP_SIZES, POSTER_SIZES } from "@/lib/tmdbService";
import { MovieDetails as MovieDetailsType } from "@/types/movie";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/providers/FavoritesProvider";
import Header from "@/components/Header";
import { ArrowLeft, Heart, Star, Clock } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const getMovieDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const movieId = parseInt(id, 10);
        const details = await fetchMovieDetails(movieId);
        
        if (isMounted) {
          setMovie(details);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching movie details:", err);
          setError("Failed to load movie details. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    getMovieDetails();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    return () => {
      isMounted = false;
    };
  }, [id]);
  
  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };
  
  const favorite = movie ? isFavorite(movie.id) : false;
  
  return (
    <div className="min-h-screen">
      <Header />
      
      {loading ? (
        <div className="pt-28 px-4 container mx-auto max-w-7xl animate-fade-in">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-32 w-full mt-4" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      ) : movie ? (
        <div className="animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            
            <div className={`w-full h-[30vh] md:h-[50vh] ${backdropLoaded ? '' : 'bg-muted'}`}>
              {movie.backdrop_path && (
                <img
                  src={getImageUrl(movie.backdrop_path, BACKDROP_SIZES.large)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onLoad={() => setBackdropLoaded(true)}
                />
              )}
            </div>
            
            <div className="container mx-auto max-w-7xl px-4 pt-28 md:pt-32 relative z-10 -mt-40">
              <Link to="/" className="inline-flex items-center text-sm mb-4 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Movies
              </Link>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 lg:w-1/4">
                  <div className={`aspect-[2/3] rounded-lg overflow-hidden ${posterLoaded ? '' : 'bg-muted'}`}>
                    <img
                      src={getImageUrl(movie.poster_path, POSTER_SIZES.large)}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onLoad={() => setPosterLoaded(true)}
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 lg:w-3/4">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {movie.title}
                  </h1>
                  
                  {movie.tagline && (
                    <p className="text-xl text-muted-foreground mb-4 italic">
                      {movie.tagline}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-6 mb-6">
                    {movie.vote_average > 0 && (
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-1" />
                        <span className="font-medium">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                    
                    {movie.runtime && (
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-1" />
                        <span>{movie.runtime} min</span>
                      </div>
                    )}
                    
                    {movie.release_date && (
                      <div className="text-muted-foreground">
                        {formatDate(movie.release_date)}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <Button
                      onClick={handleFavoriteToggle}
                      variant={favorite ? "default" : "outline"}
                      className="group"
                    >
                      <Heart className={`mr-2 h-4 w-4 ${favorite ? "fill-current" : ""}`} />
                      {favorite ? "Remove from Favorites" : "Add to Favorites"}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-medium">Overview</h2>
                    <p className="text-balance">{movie.overview}</p>
                  </div>
                  
                  {movie.homepage && (
                    <div className="mt-6">
                      <Button asChild variant="outline">
                        <a 
                          href={movie.homepage} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Official Website
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
