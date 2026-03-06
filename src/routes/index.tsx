import { createFileRoute } from '@tanstack/react-router';
import CandidateComp from '#/components/Candidate';
import type { CandidateType } from '#/types/candidate';

export const Route = createFileRoute('/')({ component: App });

const candidates: CandidateType[] = [
  {
    age: 26,
    experience: 3,
    name: 'Enmanuel',
    skills: ['JavaScript', 'React', 'Node.js'],
    status: 'Reviewing',
    working: true,
  },
  {
    age: 30,
    experience: 5,
    name: 'Jane Doe',
    skills: ['Python', 'Django', 'Machine Learning'],
    status: 'Interviewing',
    working: false,
  },
];

function App() {
  // state
  return (
    <div>
      {candidates.map((candidate) => (
        <CandidateComp data={candidate} />
      ))}
    </div>
  );
}
