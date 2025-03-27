import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React from 'react';

// Esquema de validação
const schema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditarTarefa() {
  const router = useRouter();
  const { id } = router.query;

  // Buscar a tarefa específica
  const { data: tarefa, isLoading } = trpc.tarefa.listar.useQuery(undefined, {
    select: (data: any[]) => data.find((t) => t.id === id),
  });

  // Formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Mutation para atualizar
  const atualizarTarefa = trpc.tarefa.atualizar.useMutation({
    onSuccess: () => {
      router.push('/');
    },
  });

  // Preencher o formulário quando os dados carregarem
  React.useEffect(() => {
    if (tarefa) {
      reset({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao || '',
      });
    }
  }, [tarefa, reset]);

  const onSubmit = (data: FormData) => {
    if (typeof id === 'string') {
      atualizarTarefa.mutate({
        id,
        titulo: data.titulo,
        descricao: data.descricao,
      });
    }
  };

  // Estados de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <p>Carregando...</p>
      </div>
    );
  }

  // Tarefa não encontrada
  if (!tarefa) {
    return (
      <div className="container mx-auto p-4">
        <p>Tarefa não encontrada</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Voltar para a lista
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Tarefa</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block mb-1">
            Título*
          </label>
          <input
            id="titulo"
            {...register('titulo')}
            className="w-full p-2 border rounded"
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm">{errors.titulo.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="descricao" className="block mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            {...register('descricao')}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={atualizarTarefa.isLoading}
          >
            {atualizarTarefa.isLoading ? 'Salvando...' : 'Salvar'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
        
        {atualizarTarefa.error && (
          <p className="text-red-500">{atualizarTarefa.error.message}</p>
        )}
      </form>
    </div>
  );
}