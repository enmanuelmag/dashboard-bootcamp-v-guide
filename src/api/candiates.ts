import type { CandidateType } from '#/types/candidate';

const candidates: CandidateType[] = [
  {
    id: '1',
    age: 26,
    experience: 3,
    name: 'Enmanuel',
    skills: ['JavaScript', 'React', 'Node.js'],
    status: 'Pending',
    working: true,
  },
  {
    id: '2',
    age: 30,
    experience: 5,
    name: 'Jane Doe',
    skills: ['Python', 'Django', 'Machine Learning'],
    status: 'Interviewing',
    working: false,
  },
];

const sleep = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
};

export const getCandidates = async (status?: CandidateType['status']) => {
  // await sleep();

  const filtered = status
    ? candidates.filter((c) => c.status === status)
    : candidates;

  return { candidates: filtered };
};

export const getCandidateById = async (id: number) => {
  // await sleep();

  const candidate = candidates.find((c) => c.id === String(id));

  if (!candidate) {
    throw new Error('Candidate not found - invalid ID');
  }

  return { candidate };
};
