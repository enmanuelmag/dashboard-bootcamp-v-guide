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
