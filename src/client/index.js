import * as z from 'zod';

import { validatePublicKey } from '../shared/utils.js';
import { createKeyPair, sign } from './crypto.js';
import { loadPrivateKey, loadPublicKey, savePrivateKey, savePublicKey } from './fs.js';

const clientSchema = z.object({
  port: z.number(),
  username: z.string(),
  password: z.string(),
});

export const createClient = (options = {}) => {
  // TODO: Gracefully handle the validation errors.
  const { username, password, port } = clientSchema.parse(options);

  const request = async (/** @type {string} */ path, /** @type {string} */ method, /** @type {BodyInit} */ body) => {
    // NOTE: For simplicity, this is just hard-coded but in a real client we'd have the hostname
    // and such configurable.
    return await fetch(`http://localhost:${port}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
      body,
    });
  };

  return {
    keys: {
      create() {
        const { publicKey, privateKey } = createKeyPair();
        savePublicKey(publicKey);
        savePrivateKey(privateKey);
        return { publicKey, privateKey };
      },

      get() {
        const publicKey = loadPublicKey();
        const privateKey = loadPrivateKey();
        return { publicKey, privateKey };
      },

      /**
       * @param {Buffer} message
       */
      sign(message) {
        const { privateKey } = this.get();
        if (!privateKey) {
          throw new Error('Could not load private key.');
        }
        return sign(privateKey, message);
      },
    },

    /**
     * @param {string} message
     * @param {Buffer} signature
     */
    async verify(message, signature) {
      const path = `/users/${username}/verify`;
      return await fetch(`http://localhost:4545${path}`, {
        method: 'post',
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
          'X-Signature': signature.toString('base64'),
        },
        body: message,
      });
    },

    /**
     * @param {string} username
     * @returns {Promise<string>} The public key for the user.
     */
    async getPublicKey(username) {
      const response = await request(`/users/${username}`, 'GET');
      return await response.text();
    },

    /**
     * Set the public key for the authenticated user. This will overwrite any existing public key.
     *
     * @param {string} publicKey
     * @returns {Promise<boolean>}
     */
    async setPublicKey(publicKey) {
      try {
        publicKey = validatePublicKey(publicKey);
      } catch (e) {
        throw new Error(`Invalid public key: ${e.message}`);
      }

      // TODO: Refine error handling.
      const response = await request(`/users/${username}`, 'PUT', publicKey);
      return true;
    },
  };
};
