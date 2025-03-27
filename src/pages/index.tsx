import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import Link from 'next/link';
import styles from './Index.module.css';

const Home: NextPageWithLayout = () => {
  const { data: tarefas, isLoading, refetch } = trpc.tarefa.listar.useQuery();

  const deletarTarefa = trpc.tarefa.deletar.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        <h1 className={styles.pageTitle}>Lista de Tarefas</h1>
        
        <div className={styles.buttonContainer}>
          <Link href="/nova-tarefa" className={styles.primaryButton}>
            + Nova Tarefa
          </Link>
        </div>
        
        {tarefas?.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhuma tarefa encontrada.</p>
          </div>
        ) : (
          <ul className={styles.tasksList}>
            {tarefas?.map((tarefa) => (
              <li key={tarefa.id} className={styles.taskItem}>
                <div className={styles.taskContent}>
                  <div className={styles.taskDetails}>
                    <h2 className={styles.taskTitle}>{tarefa.titulo}</h2>
                    {tarefa.descricao && (
                      <p className={styles.taskDescription}>{tarefa.descricao}</p>
                    )}
                    <p className={styles.taskMeta}>
                      Criada em: {new Date(tarefa.dataCriacao).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className={styles.taskActions}>
                    <Link
                      href={`/editar-tarefa/${tarefa.id}`}
                      className={styles.editButton}
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deletarTarefa.mutate(tarefa.id)}
                      className={styles.deleteButton}
                      disabled={deletarTarefa.isLoading}
                    >
                      {deletarTarefa.isLoading ? (
                        <span className={styles.buttonLoading}>
                          <span className={styles.loadingDot}>.</span>
                          <span className={styles.loadingDot}>.</span>
                          <span className={styles.loadingDot}>.</span>
                        </span>
                      ) : (
                        'Deletar'
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Home;