# Zachary-2022

A simple server for storing and verifying public keys.

## Usage

First, run `npm install` to install the dependencies.

### Server

To start the server, run `node server.js`. It can be configured with environment variables:

- `PORT`: The port to listen on. Defaults to `4545`.
- `USERNAME`: The username to use for the server. Defaults to `zachary`.
- `PASSWORD`: The password to use for the server. Defaults to `password`.

Example:

```bash
PORT=4546 USERNAME=zachary PASSWORD=password node server.js
```

### Client

To start the client, run `node client.js`. It can be configured with environment variables:

- `PORT`: The port to connect to. This should match the port used to launch the server.Defaults to `4545`.
- `USERNAME`: The username to use for the client. Defaults to `zachary`.
- `PASSWORD`: The password to use for the client. Defaults to `password`.

Example:

```bash
PORT=4546 USERNAME=zachary PASSWORD=password node client.js
```

Initially you will need to create a keypair:

```bash
$ node client.js create
```

You can then publish the public key to the server. The server will update its database with the public key for the logged in user.

```bash
$ node client.js publish
```

You can then sign a message:

```bash
$ node ./client.js sign -m "Message"
Message

X/5ymqgv4d9vPafNXd3Wvzh4l09dZXT2zWAkb15QGuvTfCAI5Vf2sNsN8Yn/Hile+4lP9bUNkHIfLTFv7988E05WwYhLs2Lq1piZGt6VNcw8LTXEJcaKsMuCP9oRu9vZDpn6A/ACL9ysWe0axLH0J70R5e5/PNJLWFPgU7nbIardWwpMZO4pjYelU3JFOqTOunzKcOxI02pX6sGaXt2bfR74GxwjZGEWjWMMdi9BPgJ/qzYt+SEQm0JHr6cYYLqtF2RwDVJVtcee/RAsgk18Iveqj5uBfbEfTMYbjn7gthorPmnjV1gezXAoaT+ntSDgfJ6xqaAsvc740AcMY2eIh258oUpcT6jwnogaj+SZVNWkzDlgtDn0Hj2RXVtKsFE3LgsH36b4qJxp7o8jLqajrWN/3+JfFcLg0Y2ZYKklfQ4p5IcmHA4JbPbp7fk7fp3fMUAFn9TEDZDo8/fWTISuQdjy0qTUdGAlfvhTcU6sBApX31FtUHcLn2f+cIpqaxTvXRmS8hPVtBO2a5Jz9JyeBo95UMh3tFqMiIBFWTPmYeM1JW4yVVVF/WZCx7Vk4H75Dw0h99TC60Xv/XRItO8/nzE9z0av+P37zR8uTYLRTZq5HT6Wgzd2+p9aSvAUPYLhOHUak4cNiPg9zF0WnkQbCxwYTwa3dn19HyZ49TAtUkE=
```

And finally, you can verify a signature:

```bash
$ node client.js verify -m "Message" -s "<signature>"

  The message was signed by this signature.
```

## Implementation notes

- I took a little longer than usual because I mostly use TypeScript and was missing the type annotations
  so I had to refresh myself on how to augment JavaScript with JSDoc to improve the language server's
  understanding of my code.
- I endeavored to use as much of the Node.js standard library as possible and had to relearn a lot of the
  things like CLI argument parsing. Ordinarily I have used things like Commander.
- I have left comments around for things I wanted to do but was trying to avoid getting distracted by.
- I usually would have used a more test-driven development approach but as I was starting fresh and not
  using my usual environment I didn't want to get caught up trying to get everything working together.
  I tried to code defensively to compensate a bit.
