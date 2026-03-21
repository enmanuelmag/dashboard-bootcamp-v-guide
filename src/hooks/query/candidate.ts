import DataRepo from '#/api/datasource';
import { QKeys } from '#/const/keys';
import { useQuery } from '@tanstack/react-query';

export const useCandidatesQuery = (status?: string | null) => {
  const candidatesQuery = useQuery({
    queryKey: QKeys.GET_CANDIDATES_BY_STATUS(status),
    queryFn: () => {
      return DataRepo.getCandidates(status);
    },
  });

  return candidatesQuery;
};

export const useCandidateByIdQuery = (id: string) => {
  const candidateQuery = useQuery({
    queryKey: QKeys.GET_CANDIDATE_BY_ID(id), // -> ['candidates', id]
    queryFn: () => {
      return DataRepo.getCandidateById(id);
    },
    enabled: !!id && id !== 'new',
  });

  return candidateQuery;
};
