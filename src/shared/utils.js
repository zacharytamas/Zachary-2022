export const isValidPublicKey = (/** @type {string} */ publicKey) => {
  // TODO: This is a very naive check.
  return publicKey.startsWith('-----BEGIN PUBLIC KEY-----') && publicKey.endsWith('-----END PUBLIC KEY-----\n');
};

/**
 * Validates that the provided public key is valid.
 *
 * @param {string} publicKey
 * @throws {Error} If the public key is invalid.
 * @returns {string} The public key.
 */
export const validatePublicKey = (publicKey) => {
  if (!isValidPublicKey(publicKey)) {
    throw new Error('Invalid public key.');
  }

  return publicKey;
};

/** A utility for working with HTTP Authorization headers. */
export const authorizationHeader = {
  /**
   * Given a username and password, returns an Authorization header value.
   *
   * @param {string} username
   * @param {string} password
   */
  to(username, password) {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  },

  /**
   * Given an Authorization header value, returns the username and password.
   *
   * @param {string} authorization
   */
  from(authorization) {
    return Buffer.from(authorization.split(' ')[1], 'base64').toString('utf8').split(':');
  },
};
