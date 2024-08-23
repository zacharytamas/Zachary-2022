import express from 'express';
import bodyParser from 'body-parser';

import * as z from 'zod';

import { verify } from '../client/crypto.js';
import { authorizationHeader } from '../shared/utils.js';

const requireAuthentication = (req, res, next) => {
  const { authorization } = req.headers;
  const { userStore } = res.locals;

  if (!authorization) {
    return res.status(401).send('Authentication required.');
  }

  // Ensure that the authorization header is in the format "Basic <base64 encoded username:password>".
  if (authorization.split(' ').length != 2) {
    return res.status(401).send('Invalid authorization header.');
  }

  const [username, password] = authorizationHeader.from(authorization);

  const user = userStore.getUser(username);

  if (!user || !user.password.matches(password)) {
    return res.status(401).send('Invalid username or password.');
  }

  res.locals.user = user;

  next();
};

export const createServer = (userStore) => {
  const app = express();
  app.use(bodyParser.text());

  app.use((req, res, next) => {
    res.locals.userStore = userStore;
    next();
  });

  // Then endpoint for a user to register a public key. They must be authenticated by providing the
  // correct password as an HTTP header.
  app.put('/users/:username', requireAuthentication, (req, res) => {
    const { username } = req.params;

    if (username != res.locals.user.username) {
      return res.status(403).send('You are not authorized to modify this user.');
    }

    const { userStore } = res.locals;

    const hasPublicKey = userStore.hasPublicKey(username);
    userStore.setPublicKey(username, req.body);

    if (hasPublicKey) {
      res.statusCode = 200; // 200 OK
    } else {
      res.statusCode = 201; // 201 Created
    }

    console.log(`Public key set for user ${username}.`);

    res.send();
  });

  app.get('/users/:username', (req, res) => {
    const { username } = req.params;
    const { userStore } = res.locals;

    const user = userStore.getUser(username);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    res.send(user.publicKey);
  });

  app.post('/users/:username/verify', (req, res) => {
    const { username } = req.params;
    const { userStore } = res.locals;

    const user = userStore.getUser(username);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    if (!user.publicKey) {
      return res.status(404).send('User has no public key.');
    }

    console.log(`Validating message and signature for user ${username}`);

    const message = req.body;
    const signature = z.string().parse(req.headers['x-signature']);

    if (!verify(user.publicKey, Buffer.from(message), Buffer.from(signature, 'base64'))) {
      return res.status(401).send('Invalid signature.');
    }

    res.send('OK');
  });

  return app;
};
