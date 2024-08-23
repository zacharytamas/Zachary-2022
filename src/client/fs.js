import fs from 'node:fs';

export function loadPublicKey(filename = 'public.pem') {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (e) {
    return null;
  }
}

export function loadPrivateKey(filename = 'private.pem') {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (e) {
    return null;
  }
}

/**
 * @param {string} publicKey
 */
export function savePublicKey(publicKey, filename = 'public.pem') {
  fs.writeFileSync(filename, publicKey);
}

/**
 * @param {string} privateKey
 */
export function savePrivateKey(privateKey, filename = 'private.pem') {
  fs.writeFileSync(filename, privateKey);
}
