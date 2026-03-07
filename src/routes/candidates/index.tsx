import { getCandidates } from '#/api/candiates';
import Candidate from '#/components/Candidate';
import type { CandidateType } from '#/types/candidate';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/candidates/')({
  component: RouteComponent,
  loaderDeps: ({
    search,
  }: {
    search: { status?: CandidateType['status'] };
  }) => ({ status: search.status }),
  loader: async ({ deps }) => {
    return await getCandidates(deps.status);
  },
});

function RouteComponent() {
  const { candidates } = Route.useLoaderData();

  const search = Route.useSearch();

  return (
    <div>
      <p>
        Searching for candidates with status: <b>{JSON.stringify(search)}</b>
      </p>
      {candidates.map((candidate, idx) => (
        <Candidate data={candidate} key={`candidate-${idx}`} />
      ))}
    </div>
  );
}
