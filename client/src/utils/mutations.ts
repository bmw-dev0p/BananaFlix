import { gql } from '@apollo/client';

// Mutation for logging in a user
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// Mutation for adding a new user (signup)
export const ADD_USER = gql`
  mutation addUser($input: UserInput!) {
    addUser(input: $input) {
      user {
        _id
        username
        email
        age
      }
      token
    }
  }
`;

// Mutation for saving a movie to a user's collection
export const SAVE_MOVIE = gql`
  mutation saveMovie($input: MovieInput!) {
    saveMovie(input: $input) {
      movieId
      title
      overview
      posterPath
      releaseDate
    }
  }
`;

// Mutation for removing a movie from a user's collection
export const REMOVE_MOVIE = gql`
  mutation removeMovie($movieId: ID!) {
    removeMovie(movieId: $movieId) {
      movieId
      title
      overview
      posterPath
      releaseDate
    }
  }
`;

