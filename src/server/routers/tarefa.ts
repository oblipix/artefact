import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: Date;
};

let tarefas: Tarefa[] = [
  {
    id: '1',
    titulo: 'Tarefa de exemplo',
    descricao: 'Esta é uma tarefa de exemplo',
    dataCriacao: new Date(),
  },
];

export const tarefaRouter = router({
  criar: publicProcedure
    .input(
      z.object({
        titulo: z.string().min(1, 'Título é obrigatório'),
        descricao: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const novaTarefa: Tarefa = {
        id: Date.now().toString(),
        titulo: input.titulo,
        descricao: input.descricao,
        dataCriacao: new Date(),
      };
      tarefas.push(novaTarefa);
      return novaTarefa;
    }),

  listar: publicProcedure.query(() => {
    return tarefas.sort(
      (a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime()
    );
  }),

  atualizar: publicProcedure
    .input(
      z.object({
        id: z.string(),
        titulo: z.string().min(1, 'Título é obrigatório'),
        descricao: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const index = tarefas.findIndex((t) => t.id === input.id);
      if (index === -1) {
        throw new Error('Tarefa não encontrada');
      }
      tarefas[index] = {
        ...tarefas[index],
        titulo: input.titulo,
        descricao: input.descricao,
      };
      return tarefas[index];
    }),

  deletar: publicProcedure
    .input(z.string())
    .mutation(({ input: id }) => {
      const index = tarefas.findIndex((t) => t.id === id);
      if (index === -1) {
        throw new Error('Tarefa não encontrada');
      }
      const [tarefaRemovida] = tarefas.splice(index, 1);
      return tarefaRemovida;
    }),
});