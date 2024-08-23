// This is an executable script which is a CLI interface for the client instance.

import * as z from 'zod';
import { parseArgs } from 'node:util';

import { PORT, USERNAME, PASSWORD } from './defaults.js';

const { port, username, password } = z
  .object({
    PORT: z.coerce.number().default(PORT),
    USERNAME: z.string().default(USERNAME),
    PASSWORD: z.string().default(PASSWORD),
  })
  .transform((v) => ({ port: v.PORT, username: v.USERNAME, password: v.PASSWORD }))
  .parse(process.env);

import { createClient } from './src/client/index.js';
import { loadPublicKey, loadPrivateKey } from './src/client/fs.js';

const client = createClient({ username, password, port });

const subcommand = process.argv[2];

switch (subcommand) {
  case 'create': {
    console.log('Creating key pair...');
    client.keys.create();
    console.log(`  New keypair saved to disk.`);
    break;
  }
  case 'publish': {
    console.log('Publishing public key...');

    const publicKey = loadPublicKey();
    if (!publicKey) {
      console.log('No public key found to be published. Try running "create" first.');
      process.exit(1);
    }

    await client.setPublicKey(publicKey);
    console.log(`  Public key for ${username} published.`);
    break;
  }
  case 'sign': {
    const args = parseArgs({ options: { message: { type: 'string', short: 'm' } }, allowPositionals: true });

    if (!args.values.message) {
      console.log('Please provide a message to sign.');
      process.exit(1);
    }

    const message = Buffer.from(args.values.message);
    const signature = client.keys.sign(message);

    console.log(message.toString());
    console.log();
    console.log(signature.toString('base64'));

    break;
  }
  case 'verify': {
    const args = parseArgs({
      options: { message: { type: 'string', short: 'm' }, signature: { type: 'string', short: 's' } },
      allowPositionals: true,
    });

    if (!args.values.message || !args.values.signature) {
      console.log('Please provide a message and signature to verify.');
      process.exit(1);
    }

    const message = Buffer.from(args.values.message);
    const signature = Buffer.from(args.values.signature, 'base64');

    const isValid = await client.verify(message.toString(), signature);

    if (!isValid.ok) {
      console.log(`The message was not signed by this signature.`);
      process.exit(1);
    } else {
      console.log(`The message was signed by this signature.`);
    }

    break;
  }
  default:
    console.log('Invalid subcommand:', subcommand);
    process.exit(1);
}
