import DataRepo from '#/api/datasource';
import { FormCandidateSchema } from '#/types/candidate';
import { tool } from '@openai/agents';
import { queryClient } from './query/provider';

export const SaveCandidate = tool({
  description: 'Esta herramienta sirve para crear un NUEVO candidato',
  parameters: FormCandidateSchema,
  execute: async (data) => {
    console.log('Guardando candidato: ', data);

    const success = await DataRepo.saveCandidate(data);

    queryClient.invalidateQueries({
      queryKey: ['candidates'],
      refetchType: 'all',
      exact: false,
    });

    console.log('Candidato guardado: ', success);

    return success ? 'Candidato guardado' : 'No se guardó el candidato';
  },
});
