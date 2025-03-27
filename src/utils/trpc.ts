import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '../server/routers';
import superjson from 'superjson';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    if (typeof window !== 'undefined') {
      // Client-side requests
      return {
        links: [
          loggerLink({
            enabled: (opts) => process.env.NODE_ENV === 'development',
          }),
          httpBatchLink({
            url: '/api/trpc',
            transformer: superjson,
          }),
        ],
      };
    }

    // Server-side requests
    return {
      links: [
        loggerLink({
          enabled: () => process.env.NODE_ENV === 'development',
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) {
              const headers = ctx.req.headers;
              delete headers['connection'];
              return {
                ...headers,
                'x-ssr': '1',
              };
            }
            return {};
          },
          transformer: superjson,
        }),
      ],
    };
  },
  ssr: false, // Disable SSR temporarily to isolate the issue
  transformer: superjson,
});

export default trpc;