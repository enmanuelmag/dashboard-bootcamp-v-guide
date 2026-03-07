import type { CandidateType } from '#/types/candidate';
import { Button, Paper, Text, Title } from '@mantine/core';
import { useState } from 'react';

type CandidateProps = {
  data: CandidateType;
};

const Candidate = (props: CandidateProps) => {
  const { data } = props;

  return (
    <Paper shadow="md" radius="md" withBorder p="xl">
      <Title order={3}>{data.name}</Title>
      <Text>Age: {data.age}</Text>
      <Text>Experience: {data.experience} years</Text>
      <Text>Status: {data.status}</Text>
      <Text>Skills: {data.skills.join(', ')}</Text>
      <Text>Currently Working: {data.working ? 'Yes' : 'No'}</Text>

      {/* <button onClick={() => copyInfo(data)}>Copy Info</button> */}
      <Button fullWidth mt={12} onClick={() => copyInfo(data)}>
        Copy Info
      </Button>
    </Paper>
  );

  function copyInfo(info: CandidateType) {
    const infoString = `Name: ${info.name}\nAge: ${info.age}\nExperience: ${info.experience} years\nStatus: ${info.status}\nSkills: ${info.skills.join(', ')}\nCurrently Working: ${info.working ? 'Yes' : 'No'}`;
    navigator.clipboard.writeText(infoString);
  }
};

export default Candidate;
