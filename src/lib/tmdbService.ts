
import { Movie, MovieDetails, MovieResponse } from "@/types/movie";

const API_KEY = "3e52e2f5350ae6996d4c3c78f1484bbd"; // This is a demo key for TMDB
const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_BASE_URL = "https://image.tmdb.org/t/p";
export const POSTER_SIZES = {
  small: "w185",
  medium: "w342",
  large: "w500",
  original: "original"
};
export const BACKDROP_SIZES = {
  small: "w300",
  medium: "w780",
  large: "w1280",
  original: "original"
};

export const getImageUrl = (path: string | null, size: string = POSTER_SIZES.medium): string => {
  if (!path) return "/placeholder.svg";
  return `${IMG_BASE_URL}/${size}${path}`;
};

export const fetchTrendingMovies = async (page: number = 1): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies: ${response.status}`);
  }
  
  return response.json();
};

export const fetchPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch popular movies: ${response.status}`);
  }
  
  return response.json();
};

export const fetchTopRatedMovies = async (page: number = 1): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch top rated movies: ${response.status}`);
  }
  
  return response.json();
};

export const fetchMovieDetails = async (id: number): Promise<MovieDetails> => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.status}`);
  }
  
  return response.json();
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to search movies: ${response.status}`);
  }
  
  return response.json();
};
