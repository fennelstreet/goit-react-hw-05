import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchMovies } from '../../movies-api';
import MovieList from '../../components/MovieList/MovieList';
import css from './MoviesPage.module.css';

const MoviesPage = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('query');

    if (queryParam) {
      setQuery(queryParam);
      fetchMovies(queryParam);
    }
  }, [location.search]);

  const fetchMovies = async (searchQuery) => {
    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(searchQuery);
      setMovies(data.results);
    } catch (err) {
      setError('Error searching movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`?query=${query}`);
  };

  return (
    <div className='main'>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className={css.search}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <MovieList movies={movies} />
    </div>
  );
};

export default MoviesPage;
