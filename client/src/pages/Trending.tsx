import './Trending.css';

import { gql, useQuery, useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { Movie } from '../models/Movie';
import { TVShow } from '../models/TvShow';
import {
  saveNextUpMovieIds,
  getNextUpMovieIds,
  saveSeenItMovieIds,

} from '../utils/localStorage';
import Auth from '../utils/auth';

const API_KEY = import.meta.env.VITE_REACT_APP_TMDB_API_KEY;


const TRENDING_MOVIES = gql`
  query GetTrendingMovies {
    trendingMovies {
      id
      title
      posterPath
      backdropPath
      overview
      releaseDate
      voteAverage
      mediaType
    }
  }
`;

const TRENDING_TV_SHOWS = gql`
  query GetTrendingTVShows {
    trendingTVShows {
      id
      name
      posterPath
      backdropPath
      overview
      firstAirDate
      voteAverage
      mediaType
    }
  }
`;

const SAVE_NEXT_UP_TRENDING = gql`
  mutation SaveNextUpTrending($input: MovieInput!) {
    saveNextUpTrending(input: $input) {
      _id
      username
      nextUpMovies {
        _id
        title
      }
    }
  }
`;

const SAVE_SEEN_IT_TRENDING = gql`
  mutation SaveSeenItTrending($input: MovieInput!) {
    saveSeenItTrending(input: $input) {
      _id
      username
      seenItMovies {
        _id
        title
      }
    }
  }
`;

function Trending() {
  const { loading: moviesLoading, error: moviesError, data: moviesData } = useQuery(TRENDING_MOVIES);
  const { loading: showsLoading, error: showsError, data: showsData } = useQuery(TRENDING_TV_SHOWS);
  const client = useApolloClient();

  const [expanded, setExpanded] = useState<number | null>(null); 

  const [movieProviders, setMovieProviders] = useState<{ [key: number]: any }>({}); // To store providers for movies
  const [tvShowProviders, setTvShowProviders] = useState<{ [key: number]: any }>({});; // To store providers for shows


  // LocalStorage state for Next Up and Seen It
  const [savedNextUpMovieIds, setSavedNextUpMovieIds] = useState<string[]>(getNextUpMovieIds());
  const [savedSeenItMovieIds, setSavedSeenItMovieIds] = useState<string[]>(getSeenItMovieIds());

  const toggleExpanded = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const saveToNextUp = async (movie) => {
    const movieId = movie.id.toString();

    // Check if the movie is already added
    if (savedNextUpMovieIds.includes(movieId)) {
      console.log(`Movie already in Next Up: ${movieId}`);
      return;
    }

    try {
      await client.mutate({
        mutation: SAVE_NEXT_UP_TRENDING,
        variables: {
          input: {
            movieId,
            title: movie.title || movie.name,
            overview: movie.overview,
            posterPath: movie.posterPath,
            releaseDate: movie.releaseDate || movie.firstAirDate,
            voteAverage: movie.voteAverage,
            mediaType: movie.mediaType,
            category: 'next-up', // Set default category as 'next-up' for new Next Up movies
          },
        },
      });
      setSavedNextUpMovieIds((prev) => {
        const updated = [...prev, movieId];
        saveNextUpMovieIds(updated);
        return updated;
      });
      console.log(`Successfully added to Next Up from Trending: ${movieId}`);
    } catch (error) {
      console.error('Error saving movie to Next Up from Trending:', error);
    }
  };

  const saveToSeenIt = async (movie: Movie | TVShow) => {
    const movieId = movie.id.toString();

    // Check if the movie is already marked as seen
    if (savedSeenItMovieIds.includes(movieId)) {
      console.log(`Movie already marked as Seen: ${movieId}`);
      return;
    }

    try {
      await client.mutate({
        mutation: SAVE_SEEN_IT_TRENDING,
        variables: {
          input: {
            movieId,
            title: movie.title || movie.name,
            overview: movie.overview,
            posterPath: movie.posterPath,
            releaseDate: movie.releaseDate || movie.firstAirDate,
            voteAverage: movie.voteAverage,
            mediaType: movie.mediaType,
            category: 'seen-it', // Set default category as 'seen-it' for seen movies
          },
        },
      });
      setSavedSeenItMovieIds((prev) => {
        const updated = [...prev, movieId];
        saveSeenItMovieIds(updated);
        return updated;
      });
      console.log(`Successfully marked as Seen from Trending: ${movieId}`);
    } catch (error) {
      console.error('Error saving movie to Seen It from Trending:', error);
    }
  };

  const truncateText = (text: string, length: number) =>
    text.length > length ? `${text.substring(0, length)}...` : text;

  if (moviesLoading || showsLoading) return <p>Loading...</p>;
  if (moviesError) return <p>Error loading movies: {moviesError.message}</p>;
  if (showsError) return <p>Error loading TV shows: {showsError.message}</p>;


  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  // Function to fetch watch providers (without GraphQL)
  const fetchWatchProviders = async (id: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
      );
      const data = await response.json();
      const providers = data.results?.US; // Adjust the region if needed
      if (providers) {
        setMovieProviders((prev) => ({ ...prev, [id]: providers }));
      }
    } catch (error) {
      console.error(`Error fetching providers for movie ID ${id}:`, error);
    }
  };

  // Fetch watch providers for TV shows
  const fetchWatchProvidersForTVShows = async (id: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${API_KEY}`
      );
      const data = await response.json();
      const providers = data.results?.US; // Get providers for the US region (can be adjusted)
      if (providers) {
        setTvShowProviders((prev) => ({ ...prev, [id]: providers }));
      }
    } catch (error) {
      console.error(`Error fetching providers for TV show ID ${id}:`, error);
    }
  };

  // Toggle the view of the watch providers section
  const toggleProviders = (id: number, mediaType: 'movie' | 'tv') => {
    // Toggle the expanded state for the providers section
    setExpanded(expanded === id ? null : id);

    if (mediaType === 'movie' && !movieProviders[id]) {
      fetchWatchProviders(id); // Fetch movie providers
    } else if (mediaType === 'tv' && !tvShowProviders[id]) {
      fetchWatchProvidersForTVShows(id); // Fetch TV show providers
    }
  };

  return (
    <div className="container-lg py-5">
      <h1 className="mb-4">Trending Movies (Today)</h1>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
        {moviesData.trendingMovies.map((movie: Movie) => (
          <div key={movie.id} className="col">
            <div className="card shadow-sm border-0">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.posterPath}`}
                alt={movie.title}
                className="card-img-top"
                style={{ borderRadius: '8px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">
                  {expanded === movie.id
                    ? movie.overview
                    : truncateText(movie.overview, 50)}
                  {movie.overview.length > 50 && (
                    <button
                      className="btn btn-link p-0 read-more"
                      onClick={() => toggleExpanded(movie.id)}
                    >
                      {expanded === movie.id ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </p>
                <div className="text-muted">
                  {movie.releaseDate &&
                    new Date(movie.releaseDate).toLocaleDateString()}
                </div>
                <p className="card-text">
                  <small className="rating text-muted">
                    Rating: {movie.voteAverage.toFixed(1)}/10
                  </small>
                </p>

                <div className="d-flex flex-wrap justify-content-center align-items-center gap-1 mt-1">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => saveToNextUp(movie)}
                    disabled={savedNextUpMovieIds.includes(movie.id.toString())}
                  >
                    {savedNextUpMovieIds.includes(movie.id.toString())
                      ? 'Added to Next Up'
                      : 'Add to Next Up'}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => saveToSeenIt(movie)}
                    disabled={savedSeenItMovieIds.includes(movie.id.toString())}
                  >
                    {savedSeenItMovieIds.includes(movie.id.toString())
                      ? 'Seen It'
                      : 'Mark as Seen'}
                  </button>

                  {/* Toggle Watch Providers Button */}
                  <button
                    className="watch-btn"
                    onClick={() => toggleProviders(movie.id, 'movie')} // Trigger the providers toggle and fetch
                  >
                    Watch Here
                  </button>
                  {expanded === movie.id && (
                    <div className="provider-logos">
                      {movieProviders[movie.id]?.flatrate?.length > 0 ? (
                        movieProviders[movie.id].flatrate.slice(0, 4).map((provider: any) => (
                          <img
                            key={provider.provider_id}
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="provider-logo"
                          />
                        ))
                      ) : (
                        <p className="no-providers">No streaming services available</p>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trending TV Shows Section */}
      <h1 className="mt-5 mb-4">Trending TV Shows (Today)</h1>
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4">
        {showsData.trendingTVShows.map((show: TVShow) => (
          <div key={show.id} className="col">
            <div className="card shadow-sm border-0">
              <img
                src={`https://image.tmdb.org/t/p/w200${show.posterPath}`}
                alt={show.name}
                className="card-img-top"
                style={{ borderRadius: '8px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{show.name}</h5>
                <p className="card-text">
                  {expanded === show.id
                    ? show.overview
                    : truncateText(show.overview, 50)}
                  {show.overview.length > 50 && (
                    <button
                      className="btn btn-link p-0 read-more"
                      onClick={() => toggleExpanded(show.id)}
                    >
                      {expanded === show.id ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </p>
                <div className="text-muted">
                  {show.firstAirDate &&
                    new Date(show.firstAirDate).toLocaleDateString()}
                </div>
                <p className="card-text">
                  <small className="rating text-muted">
                    Rating: {show.voteAverage.toFixed(1)}/10
                  </small>
                </p>


                <div className="d-flex flex-wrap justify-content-center align-items-center gap-1 mt-1">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => saveToNextUp(show)}
                    disabled={savedNextUpMovieIds.includes(show.id.toString())}
                  >
                    {savedNextUpMovieIds.includes(show.id.toString())
                      ? 'Added to Next Up'
                      : 'Add to Next Up'}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => saveToSeenIt(show)}
                    disabled={savedSeenItMovieIds.includes(show.id.toString())}

                {/* Toggle Watch Providers Button */}
                <button
                    className="watch-btn"
                    onClick={() => toggleProviders(show.id, 'tv')} // Trigger the providers toggle for TV shows
                  >
                    Watch Here
                  </button>
                  {expanded === show.id && (
                    <div className="provider-logos">
                      {tvShowProviders[show.id]?.flatrate?.length > 0 ? (
                        tvShowProviders[show.id].flatrate.slice(0, 4).map((provider: any) => (
                          <img
                            key={provider.provider_id}
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="provider-logo"
                          />
                        ))
                      ) : (
                        <p className="no-providers">No streaming services available</p>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
