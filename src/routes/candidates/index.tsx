import CandidateCard from '#/components/candidate-card';
import { useCandidatesQuery } from '#/hooks/query/candidate';
import { useAppStore } from '#/store';
import type { Store } from '#/types/store';
import { isLoadingQuery, isLoadingRefetchQuery } from '#/utils/queyr';
import {
  Button,
  Center,
  Container,
  Flex,
  Loader,
  Select,
  Text,
} from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/candidates/')({
  component: RouteComponent,
});

function RouteComponent() {
  // const searchParams = Route.useSearch() as { status?: string };

  const status = useAppStore((state) => state.statusFilter);
  const setState = useAppStore((state) => state.setStatusFilter);

  const candidatesQuery = useCandidatesQuery(status);

  const isLoading = isLoadingQuery(candidatesQuery);

  const isLoadingFetching = isLoadingRefetchQuery(candidatesQuery);

  return (
    <Container size="xl" py="lg">
      <Flex direction="column" gap="md">
        <Select
          data={['Pending', 'Reviewing', 'Interviewing', 'Hired', 'All']}
          label="Select filter"
          onChange={(value) => {
            if (value === 'All') {
              value = null;
            }

            setState(value as Store['statusFilter']);
          }}
        />

        <Flex align="center" justify="space-between">
          <Text mt={12} mb={12}>
            {status
              ? `Filtering by status: ${status}`
              : 'Showing all candidates'}
          </Text>

          <Button
            loading={isLoadingFetching}
            onClick={() => {
              candidatesQuery.refetch();
            }}
          >
            Refresh
          </Button>
        </Flex>

        {isLoading && (
          <Center>
            <Loader size="md" />
          </Center>
        )}

        {!isLoading && candidatesQuery.isSuccess && (
          <Flex direction="column" gap="md">
            {candidatesQuery.data.map((candidate) => (
              <CandidateCard key={candidate.id} data={candidate} />
            ))}
          </Flex>
        )}

        {!isLoading && candidatesQuery.isError && (
          <Center>
            <Text c="red">
              Failed to load candidates: {candidatesQuery.error.message}
            </Text>
          </Center>
        )}
      </Flex>
    </Container>
  );
}
