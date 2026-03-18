import type { PropsWithChildren } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  keepPreviousData,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'online',
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes,
      // options
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      networkMode: 'online',
    },
  },
});

export const Provider = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export function DevTools() {
  return (
    <ReactQueryDevtools initialIsOpen={true} buttonPosition="bottom-left" />
  );
}

export default {};
