import { tarefaRouter } from './tarefa';
import { router } from '../trpc';

export const appRouter = router({
  tarefa: tarefaRouter,
});

export type AppRouter = typeof appRouter;