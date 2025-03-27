import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

export const createContext = async (opts?: CreateNextContextOptions) => {
  return {
    req: opts?.req,
    res: opts?.res,
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;