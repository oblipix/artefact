import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Head from 'next/head';
import styles from '../styles/nova-tarefa.module.css';

// Esquema de validação
const schema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NovaTarefa() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const criarTarefa = trpc.tarefa.criar.useMutation({
    onSuccess: () => {
      router.push('/');
    },
  });

  const onSubmit = (data: FormData) => {
    criarTarefa.mutate(data);
  };

  return (
    <>
      <Head>
        <title>Nova Tarefa</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Nova Tarefa</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="titulo" className={styles.formLabel}>
              Título*
            </label>
            <input
              id="titulo"
              {...register('titulo')}
              className={styles.formControl}
              placeholder="Digite o título da tarefa"
            />
            {errors.titulo && (
              <span className={styles.errorMessage}>{errors.titulo.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descricao" className={styles.formLabel}>
              Descrição
            </label>
            <textarea
              id="descricao"
              {...register('descricao')}
              className={`${styles.formControl} ${styles.textarea}`}
              placeholder="Adicione detalhes sobre a tarefa (opcional)"
              rows={5}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={criarTarefa.isLoading}
            >
              {criarTarefa.isLoading ? (
                <>
                  <span className={styles.loadingSpinner}></span>
                  Salvando...
                </>
              ) : (
                'Salvar Tarefa'
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push('/')}
              className={styles.btnSecondary}
            >
              Cancelar
            </button>
          </div>

          {criarTarefa.error && (
            <div className={`${styles.errorMessage} ${styles.mt2}`}>
              {criarTarefa.error.message}
            </div>
          )}
        </form>
      </div>
    </>
  );
}