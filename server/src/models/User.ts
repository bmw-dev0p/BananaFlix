import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';

// import schema from Book.js
// import bookSchema from './Book.js';
// import type { BookDocument } from './Book.js';

export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}

// Added age for user identification
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: [/.+@.+\..+/, 'Must use a valid email address'] },
  password: { type: String, required: true },
  age: { type: Number, required: true },
});


// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
// userSchema.virtual('bookCount').get(function () {
//   return this.savedBooks.length;
// });

const User = model<UserDocument>('User', userSchema);

export default User;
