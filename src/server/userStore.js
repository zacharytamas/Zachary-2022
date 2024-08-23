import { validatePublicKey } from '../shared/utils.js';
import { createHash } from 'node:crypto';

const SALT = 'zachary-2022';

/**
 * A function that hashes a plaintext password using SHA256.
 *
 * @param {string} plaintext - The plaintext password to be hashed.
 * @returns {string} The hashed password as a hexadecimal string.
 */
const passwordHashFn = (plaintext) => createHash('sha256').update(`${SALT}|${plaintext}`).digest('hex');

const wrappedPassword = (/** @type {string} */ password) => ({
  password: passwordHashFn(password),
  /**
   * @param {string} submittedPassword
   */
  matches(submittedPassword) {
    return passwordHashFn(submittedPassword) == this.password;
  },
});

// NOTE: This is an abstraction for a database or similar. It is just a simple in-memory store for
// now and not persisted.

export const createUserStore = () => {
  const users = {};

  return {
    /**
     * Adds a user to the store.
     *
     * @param {string} username
     * @param {string} password
     */
    addUser(username, password) {
      users[username] = { username, password: wrappedPassword(password), publicKey: null };
    },

    /**
     * @param {string | number} username
     */
    getUser(username) {
      return users[username];
    },

    /**
     * @param {string | number} username
     * @returns {boolean}
     */
    hasPublicKey(username) {
      return users[username].publicKey != null;
    },

    /**
     * Sets the public key for a user.

     * @param {string | number} username
     * @param {any} publicKey
     */
    setPublicKey(username, publicKey) {
      const user = this.getUser(username);
      if (!user) {
        throw new Error(`User ${username} does not exist.`);
      }

      try {
        publicKey = validatePublicKey(publicKey);
      } catch (e) {
        throw new Error(`Invalid public key for user ${username}: ${e.message}`);
      }

      user.publicKey = publicKey;
    },
  };
};
