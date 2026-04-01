import DataRepo from '#/api/datasource';
import AgentEngine from '#/integrations/agent-engine';
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

export const useDeleteCandidateMutation = () => {
  const navigate = useNavigate();

  const deleteCandidateMutation = useMutation({
    mutationFn: async (id: string) => {
      return await DataRepo.deleteCandidate(id);
    },
    onSuccess: () => {
      notifications.show({
        color: 'green',
        title: 'Éxito',
        message: 'Candidato eliminado',
      });
      navigate({
        to: '/candidates',
      });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error al eliminar candidato',
      });
    },
  });

  return deleteCandidateMutation;
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (message: string) => {
      const response = await AgentEngine.run(message);
      return response;
    },
    onError: (error) => {
      console.error('Error sending message to agent:', error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error al enviar mensaje al agente',
      });
    },
  });
};

export const useToggleWorkingMutation = () => {
  return useMutation({
    mutationFn: async ({
      id,
      newWorkingValue,
    }: {
      id: string;
      newWorkingValue: boolean;
    }) => {
      return await DataRepo.toggleWorking(id, newWorkingValue);
    },
    onError: (error) => {
      console.error('Error toggling working state:', error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error al actualizar estado de trabajo',
      });
    },
  });
};
