
import { useState, useEffect } from "react";
import { fetchPopularMovies, fetchTrendingMovies, searchMovies } from "@/lib/tmdbService";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<string>("trending");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  
  // Effect to handle search params
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
      setTab("search");
    }
  }, [searchParams]);
  
  // Effect to fetch movies when tab or page changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchMovies = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let response;
        
        if (tab === "search" && searchQuery) {
          response = await searchMovies(searchQuery, 1);
        } else if (tab === "popular") {
          response = await fetchPopularMovies(1);
        } else {
          // Default to trending
          response = await fetchTrendingMovies(1);
        }
        
        if (isMounted) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
          setHasMore(response.page < response.total_pages);
          setPage(1);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching movies:", err);
          setError("Failed to fetch movies. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchMovies();
    
    return () => {
      isMounted = false;
    };
  }, [tab, searchQuery]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ search: query });
    setTab("search");
  };
  
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    try {
      const nextPage = page + 1;
      let response;
      
      if (tab === "search" && searchQuery) {
        response = await searchMovies(searchQuery, nextPage);
      } else if (tab === "popular") {
        response = await fetchPopularMovies(nextPage);
      } else {
        response = await fetchTrendingMovies(nextPage);
      }
      
      setMovies((prev) => [...prev, ...response.results]);
      setPage(nextPage);
      setHasMore(nextPage < response.total_pages);
    } catch (err) {
      console.error("Error loading more movies:", err);
    } finally {
      setLoadingMore(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setTab(value);
    if (value !== "search") {
      setSearchQuery("");
      setSearchParams({});
    }
  };
  
  return (
    <div className="min-h-screen pb-20">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 pt-28 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8 md:text-4xl text-center">
          Discover Movies
        </h1>
        
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full mb-8">
          <TabsList className="w-full max-w-md mx-auto">
            <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
            <TabsTrigger value="popular" className="flex-1">Popular</TabsTrigger>
            {searchQuery && (
              <TabsTrigger value="search" className="flex-1">Search</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="trending" className="mt-6">
            <h2 className="text-xl font-medium mb-4">Trending This Week</h2>
          </TabsContent>
          
          <TabsContent value="popular" className="mt-6">
            <h2 className="text-xl font-medium mb-4">Popular Movies</h2>
          </TabsContent>
          
          <TabsContent value="search" className="mt-6">
            <h2 className="text-xl font-medium mb-4">
              {searchQuery ? `Search results for "${searchQuery}"` : "Search Movies"}
            </h2>
          </TabsContent>
        </Tabs>
        
        {error ? (
          <div className="text-center py-10">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 animate-fade-in">
            {Array.from({ length: 10 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">
              {tab === "search" 
                ? "No movies found matching your search."
                : "No movies available at the moment."}
            </p>
            {tab === "search" && (
              <Button variant="outline" onClick={() => handleTabChange("trending")}>
                View Trending Movies
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 animate-fade-in">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button 
                  onClick={handleLoadMore} 
                  disabled={loadingMore}
                  size="lg"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
