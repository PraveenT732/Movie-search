import { useState } from "react";
import MovieCard from "./component/MovieCard";
import "./App.css"

export default function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!search.trim()) {
      setError("Enter a valid movie name!");
      setMovies([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=b67b56b&s=${encodeURIComponent(search.trim())}`,
      );
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error || "No movies found");
      }
    } catch {
      setMovies([]);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Movie Search</h1>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={search}
          placeholder="Enter a movie name"
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>
      {loading && <p>Loading movies...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>Search movies to display</p>
      )}
      {!loading && !error && movies.length > 0 && (
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.imbdID}/>
          ))}
        </div>
      )}
    </div>
  );
}
