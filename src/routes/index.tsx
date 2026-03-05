import { createFileRoute } from '@tanstack/react-router';
import CandidateComp from '#/components/Candidate';
import type { CandidateType } from '#/types/candidate';

export const Route = createFileRoute('/')({ component: App });

const candidate: CandidateType = {
  age: 26,
  experience: 3,
  name: 'Enmanuel adasd',
  skills: ['JavaScript', 'React', 'Node.js'],
  status: 'Reviewing',
  working: true,
};

function App() {
  // state
  return (
    <div>
      <CandidateComp data={candidate} />
    </div>
  );
}
