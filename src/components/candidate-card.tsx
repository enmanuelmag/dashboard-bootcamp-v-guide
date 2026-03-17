import type { CandidateType } from '#/types/candidate';
import { Badge, Button, Flex, Paper, Text, Title } from '@mantine/core';
import { Link } from '@tanstack/react-router';

type CandidateProps = {
  data: CandidateType;
};

const CandidateCard = (props: CandidateProps) => {
  const { data } = props;

  return (
    <Paper shadow="md" radius="md" withBorder p="xl">
      <Flex align="center" justify="space-between">
        <Title order={3}>{data.name}</Title>
        <Link to={`/candidates/$candidateId`} params={{ candidateId: data.id }}>
          <Button variant="light" size="sm">
            Ver detalles
          </Button>
        </Link>
      </Flex>
      {/* <Text>Age: {data.age}</Text> */}
      <Text>Experience: {data.experience} years</Text>
      <Badge color={statusColor(data.status)} mt={8} size="lg">
        {data.status}
      </Badge>
      {/* <Text>Skills: {data.skills.join(', ')}</Text> */}
      {/* <Text>Currently Working: {data.working ? 'Yes' : 'No'}</Text> */}

      {/* <Button fullWidth mt={12} onClick={() => copyInfo(data)}>
        Copy Info
      </Button> */}
    </Paper>
  );

  function statusColor(status: CandidateType['status']) {
    if (status === 'Pending') return 'yellow';
    if (status === 'Reviewing') return 'blue';
    if (status === 'Interviewing') return 'orange';
    if (status === 'Hired') return 'green';
    return 'gray';
  }

  // function copyInfo(info: CandidateType) {
  //   const infoString = `Name: ${info.name}\nAge: ${info.age}\nExperience: ${info.experience} years\nStatus: ${info.status}\nSkills: ${info.skills.join(', ')}\nCurrently Working: ${info.working ? 'Yes' : 'No'}`;
  //   navigator.clipboard.writeText(infoString);
  // }
};

export default CandidateCard;
