import express, { Express } from 'express';
import { createNestExpressApp } from '../src/app.factory';

let cachedServer: Express | null = null;
let bootstrapPromise: Promise<Express> | null = null;

async function getServer() {
  if (cachedServer) {
    return cachedServer;
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const server = express();
      await createNestExpressApp(server);
      cachedServer = server;
      return server;
    })();
  }

  return bootstrapPromise;
}

export default async function handler(req: any, res: any) {
  const server = await getServer();
  return server(req, res);
}
