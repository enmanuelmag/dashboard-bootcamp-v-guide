import type { UseQueryResult } from '@tanstack/react-query';

export const isLoadingQuery = (...results: Array<UseQueryResult>) => {
  return results.some((r) => r.isFetching && !r.isRefetching);
};

export const isLoadingRefetchQuery = (...results: Array<UseQueryResult>) => {
  return results.some((r) => r.isFetching || r.isLoading);
};

export const isLoadingMutation = (...results: Array<any>) => {
  return results.some((r) => r.isPending && !r.isIdle);
};
