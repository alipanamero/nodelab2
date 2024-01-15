import http from 'http';
import process from 'process';
import { Buffer } from 'buffer';
import { createRouter } from './router.js';

const parseOptions = {
  'text/plain': (text) => text,
  'text/html': (text) => text,
  'application/json': (json) => jsonParseSafe(json, {}),
  'application/x-www-form-urlencoded': (text) => Object.fromEntries(new URLSearchParams(text)),
};

async function parseBody(req, parser) {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  return parser(data);
}

export function createHttpServer(routes, port = 3000) {
  const server = http.createServer(async (req, res) => {
    const handlerKey = req.method?.toUpperCase() + req.url;
    const handler = routes.get(handlerKey);
    if (!handler) return errorResponse(res, 'Not found');
    const contentType = req.headers['content-type']?.split(';')[0];
    const parser = parseOptions[contentType];
    let payload = {};
    if (contentType && parser) payload = await parseBody(req, parser);
    try {
      await handler(req, res, payload);
    } catch (error) {
      console.error(error);
      errorResponse(res, 'Server error');
    }
  }).listen(port, () => console.log('Server started on port:', port));

  function gracefulShutdown() {
    console.log('Shutdown');
    server.close((error) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
    });
  }

  server.on('clientError', (err, socket) => {
    console.error(err);
    socket.end('Bad Request');
  });

  process.on('SIGINT', () => {
    gracefulShutdown();
  });
}

function jsonParseSafe(data, fallback = {}) {
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

function errorResponse(res, errorMessage) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ status: 'Error!', message: errorMessage }));
}
