const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const ngrok = require('ngrok');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const NGROK_AUTH_TOKEN = '2o0gMWDOnBFURgxC7ybgPYZOXSQ_5ZgCRfmyw5a3rUY9RUf5q';

async function startServer() {
  try {
    await app.prepare();

    const server = createServer(async (req, res) => {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    });

    server.listen(3000, async (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');

      try {
        const url = await ngrok.connect({
          addr: 3000,
          authtoken: NGROK_AUTH_TOKEN
        });
        console.log('\x1b[32m%s\x1b[0m', `> Ngrok tunnel created at: ${url}`);
      } catch (error) {
        console.error('Error creating ngrok tunnel:', error);
      }
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer(); 