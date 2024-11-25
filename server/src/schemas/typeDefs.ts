import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Movie {
    _id: ID!
    movieId: String!
    title: String
    overview: String!
    posterPath: String
    releaseDate: String
    voteAverage: Float
    mediaType: String
    category: String # Add this if you want to store category in the database
  }

  type APIMovie {
    adult: Boolean!
    backdropPath: String
    genreIds: [Int!]!
    id: ID!
    originalLanguage: String!
    originalTitle: String!
    overview: String
    popularity: Float
    posterPath: String
    releaseDate: String
    title: String!
    video: Boolean!
    voteAverage: Float
    voteCount: Int
    mediaType: String!
  }

  type APITVShow {
    adult: Boolean!
    backdropPath: String
    genreIds: [Int!]!
    id: ID!
    originalLanguage: String!
    originalName: String!
    overview: String
    popularity: Float
    posterPath: String
    firstAirDate: String
    name: String!
    voteAverage: Float
    voteCount: Int
    mediaType: String!
    first_air_date: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    savedMovies: [Movie]
    nextUpMovies: [Movie!]!
    seenItMovies: [Movie!]!
    movieRatings: [MovieRating]
  }

  type Auth {
    token: String!
    user: User
  }

  type MovieRating {
    movieId: String!
    rating: Float
  }

  type TVShow {
    id: ID!
    name: String!
    overview: String
    poster_path: String
    first_air_date: String
    popularity: Float
  }

  type Query {
    me: User
    trendingMovies: [APIMovie!]!
    trendingTVShows: [APITVShow!]!
  }

  input MovieInput {
    movieId: String!
    title: String!
    overview: String!
    posterPath: String
    releaseDate: String
    voteAverage: Float
    mediaType: String!
    category: String! # Add this to match what's being sent from the client
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(input: UserInput!): Auth
    saveNextUpMovie(input: MovieInput!): User
    saveSeenItMovie(input: MovieInput!): User
    removeMovie(movieId: String!): User
    rateMovie(movieId: String!, rating: Float!): User
    saveNextUpTrending(input: MovieInput!): User
    saveSeenItTrending(input: MovieInput!): User
  }
`;

export default typeDefs;