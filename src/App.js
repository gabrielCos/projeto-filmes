import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-1ce9b-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadesMovies = [];

      //GOING THROUGH THE DATA BASE WITH A FOR 
      for (const key in data){
        loadesMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }
      setMovies(loadesMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  //FUNCTION TO ADD FILMS EM DATA BASE
  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-1ce9b-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      //changing a js obj in a json 
      body: JSON.stringify(movie), 
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  let content = <p>No movies yet</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);


  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} movies={movies} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
