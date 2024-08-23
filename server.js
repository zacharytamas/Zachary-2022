// This is an executable script for starting a server instance.

import * as z from 'zod';

import { PORT, USERNAME, PASSWORD } from './defaults.js';
import { createServer } from './src/server/index.js';
import { createUserStore } from './src/server/userStore.js';

const { port, username, password } = z
  .object({
    PORT: z.coerce.number().default(PORT),
    USERNAME: z.string().default(USERNAME),
    PASSWORD: z.string().default(PASSWORD),
  })
  .transform((v) => ({ port: v.PORT, username: v.USERNAME, password: v.PASSWORD }))
  .parse(process.env);

console.log('Creating user store...');
const userStore = createUserStore();
userStore.addUser(username, password);
console.log(`  Created user ${username}.`);
console.log();

const server = createServer(userStore);

server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
