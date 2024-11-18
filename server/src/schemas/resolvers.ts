import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

// Define types for the arguments
interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
    age: number;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

const resolvers = {
  Query: {
    // Fetch the logged-in user's details
    me: async (_parent: any, _args: any, context: any) => {
      console.log('User:', context.user);

      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('Could not authenticate user.');
    },

    // Fetch a single user by username
    user: async (_parent: any, { username }: UserArgs) => {
      console.log('Searching for user with username:', username);

      const user = await User.findOne({ username });
      if (!user) {
        console.log(`No user found with username: ${username}`);
        return null; // Explicitly return null if no user is found
      }

      console.log('Found user:', user);
      return user;
    },
  },

  Mutation: {
    // Add a new user (sign up)
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const { username, email, password, age } = input;

      // Log age group
      if (age <= 18) {
        console.log('Kids');
      }

      const user = await User.create({ username, email, password, age });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Log in an existing user
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
  },
};

export default resolvers;
