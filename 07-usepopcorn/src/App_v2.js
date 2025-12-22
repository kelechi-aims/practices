import { useEffect, useState } from "react";
import StarRating from "./StarRating";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

// Helper function to calculate average
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// OMDb API key
const KEY = "b193b3f6";

export default function App() {
  const [query, setQuery] = useState(""); // initial empty query

  const [movies, setMovies] = useState([]); // initial empty movies list
  const [watched, setWatched] = useState([]); // initial empty watched list
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [error, setError] = useState(""); // error state
  const [selectedId, setSelectedId] = useState(null); // selected movie ID

  /*
  useEffect(() => {
    console.log("After first render");
  }, []); -- runs only once after initial render

  useEffect(() => {
    console.log("After every render");
  }); -- runs after every render

  console.log("During render"); -- runs during every render

  useEffect(() => {
    console.log("D");
  }, [query]); -- runs only when 'query' changes
*/

  // handler functions for various actions
  // selecting a movie
  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  };

  // closing movie details
  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  // adding a movie to watched list
  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  // deleting a movie from watched list
  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  // fetching movies based on query
  useEffect(() => {
    const controller = new AbortController(); // to abort fetch if needed
    const fetchMovies = async () => {
      try {
        setIsLoading(true); // start loading
        setError(""); // reset error
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        ); // fetch movies from OMDb API

        // handle non-OK responses
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json(); // parse JSON response

        // handle API errors
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search); // update movies state
        setError(""); // reset error
      } catch (err) {
        console.log(err.message); // log error message

        if (err.name !== "AbortError") {
          // ignore abort errors
          setError(err.message); // set error state
        }
      } finally {
        setIsLoading(false); // end loading
      }
    };

    // only fetch if query length is 3 or more
    if (query.length < 3) {
      setMovies([]); // clear movies
      setError(""); // clear error
      return;
    }

    handleCloseMovie(); // close movie details when new search is made
    fetchMovies(); // initiate fetch

    // cleanup function to abort fetch on unmount or query change
    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MoviesList movies={movies} />} */}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
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

// Loader component to show loading state
function Loader() {
  return <p className="loader">Loading...</p>;
}

// ErrorMessage component to show error messages
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️ </span>
      {message}
    </p>
  );
}

// Main layout component
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// Box component with toggle functionality
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true); // box is open by default

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function ListBox({ movies }) {
//   const [isOpen1, setIsOpen1] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen1((open) => !open)}
//       >
//         {isOpen1 ? "–" : "+"}
//       </button>
//       {isOpen1 && <MoviesList movies={movies} />}
//     </div>
//   );
// }

// function WatchedBox() {
//   const [watched, setWatched] = useState([tempWatchedData]);

//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

// WatchedMoviesList component to display list of watched movies
function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

// WatchedMovie component to display individual watched movie
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

// WatchedSummary component to display summary of watched movies
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)); // average IMDb rating
  const avgUserRating = average(watched.map((movie) => movie.userRating)); // average user rating
  const avgRuntime = average(watched.map((movie) => movie.runtime)); // average runtime

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// MoviesList component to display list of movies
function MoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

// Movie component to display individual movie
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// MovieDetails component to display detailed information about a movie
function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movieDetails, setMovieDetails] = useState({}); // movie details state
  const [isLoading, setIsLoading] = useState(false); // loading state
  const [error, setError] = useState(""); // error state
  const [userRating, setUserRating] = useState(""); // user rating state

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId); // check if movie is already watched
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating; // get user rating for watched movie

  // destructure movie details
  const {
    Title,
    Year,
    Poster,
    Runtime: runtime,
    imdbRating,
    Plot,
    Released,
    Actors,
    Director,
    Genre,
  } = movieDetails;

  // handler to add movie to watched list
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title,
      Year,
      Poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie); // call parent handler to add movie
    onCloseMovie(); // close movie details
  }

  // effect to handle Escape key for closing movie details
  useEffect(() => {
    const callback = (e) => {
      if (e.code === "Escape") {
        onCloseMovie(); // call parent handler to close movie details
        // console.log("CLOSING");
      }
    };

    document.addEventListener("keydown", callback); // add event listener for keydown

    // cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseMovie]);

  // effect to fetch movie details when selectedId changes
  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        if (!res.ok)
          throw new Error("Something went wrong with fetching movie details");

        const data = await res.json();
        if (data.Response === "False")
          throw new Error("Movie details not found");

        console.log(data);
        setMovieDetails(data);
        setError("");
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getMovieDetails();
  }, [selectedId]);

  // effect to update document title based on movie title
  useEffect(() => {
    if (!Title) return; // don't run until we have a title
    document.title = `Movie | ${Title}`;

    return () => {
      document.title = "usePopcorn"; // optional: restore when details close
    };
  }, [Title]);

  return (
    <div className="details">
      {isLoading && <Loader />}
      {error && <ErrorMessage error={error} />}
      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={Poster} alt={`Poster of ${movieDetails} movie`} />
            <div className="detail-overview">
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {runtime}
              </p>
              <p>{Genre}</p>
              <p>
                <span>⭐️</span>
                <span>{imdbRating} IMDb rating</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>
                  You have rated this movie {watchedUserRating} <span>⭐️</span>
                </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRate={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to watched list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{Plot}</em>
            </p>
            <p>Starring {Actors}</p>
            <p>Directed by {Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

// NavBar component for the top navigation bar
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

// NumResult component to display number of results
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// Search component for movie search input
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// Logo component for the app logo
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
