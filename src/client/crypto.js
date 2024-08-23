import crypto, { KeyObject } from 'node:crypto';

/**
 * Creates an RSA key pair and returns the public and private keys as PEM-encoded strings.
 *
 * @returns {{publicKey: string, privateKey: string}} A key pair.
 */
export const createKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  return { publicKey, privateKey };
};

/**
 * Signs a message using the provided private key.
 *
 * @param {any} privateKey
 * @param {Buffer} data
 */
export function sign(privateKey, data) {
  return crypto.sign('SHA256', data, { key: privateKey, format: 'pem' });
}

/**
 * Verifies that a provided signature is valid for a given public key and data.
 *
 * @param {string} publicKey
 * @param {Buffer} data
 * @param {Buffer} signature
 */
export function verify(publicKey, data, signature) {
  return crypto.verify('sha256', data, publicKey, signature);
}
