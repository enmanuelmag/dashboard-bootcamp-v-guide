import type { CandidateType } from '#/types/candidate';
import { useState } from 'react';

type CandidateProps = {
  data: CandidateType;
};

const Candidate = (props: CandidateProps) => {
  const { data } = props;

  const [valor, actualizar] = useState(0);

  return (
    <article
      style={{
        border: '2px solid #000',
        margin: '10px',
      }}
    >
      <h2>{data.name}</h2>
      <p>Age: {data.age}</p>
      <p>Experience: {data.experience} years</p>
      <p>Status: {data.status}</p>
      <p>Skills: {data.skills.join(', ')}</p>
      <p>Currently Working: {data.working ? 'Yes' : 'No'}</p>

      <button onClick={() => copyInfo(data)}>Copy Info</button>
    </article>
  );

  function copyInfo(info: CandidateType) {
    const infoString = `Name: ${info.name}\nAge: ${info.age}\nExperience: ${info.experience} years\nStatus: ${info.status}\nSkills: ${info.skills.join(', ')}\nCurrently Working: ${info.working ? 'Yes' : 'No'}`;
    navigator.clipboard.writeText(infoString);
  }
};

export default Candidate;
