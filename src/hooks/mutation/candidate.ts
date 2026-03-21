import DataRepo from '#/api/datasource';
import { queryClient } from '#/integrations/query/provider';
import type { FormCandidateType, UpdateCandidateType } from '#/types/candidate';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export const useSaveCandidateMutation = () => {
  const navigate = useNavigate();

  const saveCandidateMutation = useMutation({
    mutationFn: async (data: FormCandidateType) => {
      console.log('Saving candidate with data:', data);
      await DataRepo.saveCandidate(data);
      return true;
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Éxito',
        message: 'Candidato guardado',
      });

      queryClient.invalidateQueries({
        predicate: (query) => {
          const secondKey = query.queryKey[1] as
            | { status?: string }
            | undefined;

          const value =
            query.queryKey[0] === 'candidates' &&
            secondKey?.status !== undefined;

          console.log('Invalidating query:', query.queryKey, { value });
          return value;
        },
        refetchType: 'all',
      });

      navigate({
        to: '/candidates',
      });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error al guardar candidato',
      });
    },
  });

  return saveCandidateMutation;
};

export const useUpdateCandidateMutation = () => {
  const navigate = useNavigate();

  const updateCandidateMutation = useMutation({
    mutationFn: async (data: UpdateCandidateType) => {
      return await DataRepo.updateCandidate(data);
    },
    onSuccess: (candidateId) => {
      notifications.show({
        color: 'green',
        title: 'Éxito',
        message: 'Candidato actualizado',
      });

      queryClient.invalidateQueries({
        queryKey: ['candidates'],
        refetchType: 'all',
      });

      queryClient.invalidateQueries({
        queryKey: ['candidates', candidateId],
        refetchType: 'all',
      });

      navigate({
        to: '/candidates',
      });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error al actualizar candidato',
      });
    },
  });

  return updateCandidateMutation;
};
