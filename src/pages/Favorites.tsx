
import { useFavorites } from "@/providers/FavoritesProvider";
import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Favorites() {
  const { favorites } = useFavorites();
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20">
        <Header />
        
        <main className="container mx-auto px-4 pt-28 max-w-7xl animate-fade-in">
          <h1 className="text-3xl font-bold mb-8 md:text-4xl text-center">
            My Favorites
          </h1>
          
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-medium mb-4">No favorite movies yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start exploring movies and add them to your favorites to see them here.
              </p>
              <Button asChild size="lg">
                <Link to="/">
                  Explore Movies
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
