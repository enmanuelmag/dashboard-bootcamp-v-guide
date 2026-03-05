import type { CandidateType } from '#/types/candidate';

type CandidateProps = {
  data: CandidateType;
};

const Candidate = (props: CandidateProps) => {
  const { data } = props;
  return (
    <article>
      <h2>{data.name}</h2>
      <p>Age: {data.age}</p>
      <p>Experience: {data.experience} years</p>
      <p>Status: {data.status}</p>
      <p>Skills: {data.skills.join(', ')}</p>
      <p>Currently Working: {data.working ? 'Yes' : 'No'}</p>
    </article>
  );

  function hello() {
    console.log('Hello');
  }
};

export default Candidate;
