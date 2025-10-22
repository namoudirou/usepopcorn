import { useEffect, useState } from "react";
import Loader from "./Components/Loader";
import ErrorMessage from "./Components/ErrorMessage";
import Logo from "./Components/Logo";
import Numresults from "./Components/Numresults";
import Navbar from "./Components/Navbar";
import Search from "./Components/Search";
import Main from "./Components/Main";
import Box from "./Components/Box";
import MovieDetails from "./Components/MovieDetails";
import MoviesList from "./Components/MoviesList";
import WatchedSummary from "./Components/WatchedSummary";
import WatchedMoviesList from "./Components/WatchedMoviesList";

const KEY = "22209b51";

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState(function () {
    return JSON.parse(localStorage.getItem("watched")) ?? [];
  });
  const [movies, setMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleClickMovie(id) {
    setSelectedId(selectedId === id ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddMovie(movie) {
    setWatched([...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      let controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          let res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("Something went wrong with fetching movies");
          }
          let data = await res.json();

          if (data.Response === "False") {
            throw new Error("Movie not Found!");
          }

          setMovies(data.Search);
        } catch (err) {
          console.log(err.name);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setError("");
        return;
      }

      fetchMovies();
      handleCloseMovie();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Numresults movieNumber={movies.length} />
      </Navbar>
      <Main>
        <Box>
          {isloading && <Loader />}
          {!isloading && !error && (
            <MoviesList onHandleClickMovie={handleClickMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              watched={watched}
              onCloseMovie={handleCloseMovie}
              onAddMovie={handleAddMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
