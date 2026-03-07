import { getCandidateById } from '#/api/candiates';
import { Box, Paper, Text, Title } from '@mantine/core';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/candidates/$candidateId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { candidateId } = params;

    if (!candidateId) {
      throw new Error('Candidate ID is required');
    }

    return getCandidateById(Number(candidateId));
  },
});

function RouteComponent() {
  const { candidate } = Route.useLoaderData();

  const { candidateId } = Route.useParams();

  return (
    <Box>
      <Title order={1}>Candidate Details - ID: {candidateId}</Title>

      <Paper shadow="sm" p="md">
        <Title order={2}>{candidate.name}</Title>
        <Text>Age: {candidate.age}</Text>
        <Text>Experience: {candidate.experience} years</Text>
        <Text>Skills: {candidate.skills.join(', ')}</Text>
        <Text>Status: {candidate.status}</Text>
        <Text>Working: {candidate.working ? 'Yes' : 'No'}</Text>
      </Paper>
      <Outlet />
    </Box>
  );
}
