// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';

interface UserToken {
  name: string;
  exp: number;
}

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode<UserToken>(token);
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    if (!token) return false; // No token means not logged in
    if (this.isTokenExpired(token)) {
      this.logout(); // Clear expired tokens
      return false;
    }
    return true; // Token is valid and not expired
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      // Check expiration against current time
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Error decoding token:', err);
      return true; // Treat invalid tokens as expired
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/'); // Reload to apply login state
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // Reload the page to reset state
    window.location.assign('/');
  }
}

export default new AuthService();
