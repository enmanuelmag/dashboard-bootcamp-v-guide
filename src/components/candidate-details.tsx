import type { CandidateType } from '#/types/candidate';
import {
  Badge,
  Box,
  Button,
  Fieldset,
  Flex,
  List,
  Text,
  Title,
} from '@mantine/core';

type CandidateProps = {
  data: CandidateType;
};

const CandidateDetails = (props: CandidateProps) => {
  const { data } = props;

  return (
    <Box>
      <Fieldset legend="Personal Info" mb="md">
        <Flex justify="space-between">
          <Flex direction="column">
            <Flex align="center" justify="space-between">
              <Title order={3}>{data.name}</Title>
            </Flex>
            <Text>Age: {data.age}</Text>
          </Flex>

          <Badge color={statusColor(data.status)} mt={8} size="lg">
            {data.status}
          </Badge>
        </Flex>
      </Fieldset>

      <Fieldset legend="Professional Info">
        <Text>Experience: {data.experience} years</Text>

        <Text>Currently Working: {data.working ? 'Yes' : 'No'}</Text>

        <Text mt={12} mb={6}>
          Skills:
        </Text>
        <List mt={12} size="sm" spacing="xs" type="unordered">
          {data.skills.map((skill, index) => (
            <List.Item key={index}>{skill}</List.Item>
          ))}
        </List>
      </Fieldset>

      <Button fullWidth mt={12} onClick={() => copyInfo(data)}>
        Copy Info
      </Button>
    </Box>
  );

  function statusColor(status: CandidateType['status']) {
    if (status === 'Pending') return 'yellow';
    if (status === 'Reviewing') return 'blue';
    if (status === 'Interviewing') return 'orange';
    if (status === 'Hired') return 'green';
    return 'gray';
  }

  function copyInfo(info: CandidateType) {
    const infoString = `Name: ${info.name}\nAge: ${info.age}\nExperience: ${info.experience} years\nStatus: ${info.status}\nSkills: ${info.skills.join(', ')}\nCurrently Working: ${info.working ? 'Yes' : 'No'}`;
    navigator.clipboard.writeText(infoString);
  }
};

export default CandidateDetails;
