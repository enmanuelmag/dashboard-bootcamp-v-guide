import CandidateDetails from '#/components/candidate-details';
import { useCandidateByIdQuery } from '#/hooks/query/candidate';
import { isLoadingQuery } from '#/utils/queyr';
import { Center, Container, Loader, Text } from '@mantine/core';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(private)/candidates/$candidateId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { candidateId } = Route.useParams();

  const candidateQuery = useCandidateByIdQuery(candidateId);

  const isLoading = isLoadingQuery(candidateQuery);

  if (isLoading) {
    <Center>
      <Loader size="xl" />
    </Center>;
  }

  return (
    <Container size="xl" py="lg">
      {candidateQuery.isSuccess && candidateQuery.data && (
        <CandidateDetails data={candidateQuery.data} />
      )}

      {candidateQuery.isError && (
        <Text c="red" mt={12}>
          Error loading candidate details
        </Text>
      )}
      <Outlet />
    </Container>
  );
}
