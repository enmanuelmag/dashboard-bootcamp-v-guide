import CandidateCard from '#/components/candidate-card';
import { useSendMessage } from '#/hooks/mutation/candidate';
import { useCandidatesQuery } from '#/hooks/query/candidate';
import { useAppStore } from '#/store';
import type { Store } from '#/types/store';
import { isLoadingQuery, isLoadingRefetchQuery } from '#/utils/queyr';
import {
  Button,
  Center,
  Container,
  Flex,
  Loader,
  Modal,
  Select,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import React, { useDeferredValue } from 'react';

export const Route = createFileRoute('/candidates/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isChatModal, onClose] = React.useState(false);

  const [message, setMessage] = React.useState('');

  const [query, setQuery] = React.useState('');

  const deferredQuery = useDeferredValue(query);

  const status = useAppStore((state) => state.statusFilter);
  const setState = useAppStore((state) => state.setStatusFilter);

  const candidatesQuery = useCandidatesQuery(status);

  const sendMessageMutation = useSendMessage();

  const isLoading = isLoadingQuery(candidatesQuery);

  const isLoadingFetching = isLoadingRefetchQuery(candidatesQuery);

  const filteredCandidates = React.useMemo(() => {
    if (!candidatesQuery.data) {
      return [];
    }

    if (deferredQuery.length === 0) {
      return candidatesQuery.data;
    }

    return candidatesQuery.data.filter((candidate) =>
      candidate.name.toLowerCase().includes(deferredQuery),
    );
  }, [deferredQuery, candidatesQuery.data]);

  const isSearching = query !== deferredQuery;

  return (
    <Container size="xl" py="lg">
      <Flex direction="column" gap="md">
        <Select
          data={['Pending', 'Reviewing', 'Interviewing', 'Hired', 'All']}
          label="Select filter"
          onChange={(value) => {
            if (value === 'All') {
              value = null;
            }

            setState(value as Store['statusFilter']);
          }}
        />

        <TextInput
          label="Search by name"
          placeholder="Type candidate name"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />

        <Flex align="center" justify="space-between">
          <Text mt={12} mb={12}>
            {status
              ? `Filtering by status: ${status}`
              : 'Showing all candidates'}
          </Text>

          <Button
            loading={isLoadingFetching}
            onClick={() => {
              candidatesQuery.refetch();
            }}
          >
            Refresh
          </Button>
          <Button onClick={() => onClose(true)}>Chat</Button>
        </Flex>

        <Modal
          centered
          opened={isChatModal}
          onClose={() => onClose(false)}
          title="Chat with Agent"
          size="lg"
        >
          <TextInput
            label="Escribe tu mensaje para el agente"
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
          />
          <Button
            mt="md"
            loading={sendMessageMutation.isPending}
            onClick={() => {
              sendMessageMutation.mutate(message);
            }}
          >
            Enviar
          </Button>

          {(sendMessageMutation.data || sendMessageMutation.error?.message) && (
            <Textarea
              autosize
              minRows={2}
              variant="filled"
              value={
                sendMessageMutation.data || sendMessageMutation.error?.message
              }
            />
          )}
        </Modal>

        {isLoading && (
          <Center>
            <Loader size="md" />
          </Center>
        )}

        {isSearching && (
          <Center>
            <Loader size="md" />
            <Text>Filtrando</Text>
          </Center>
        )}

        {!isLoading && !isSearching && candidatesQuery.isSuccess && (
          <Flex direction="column" gap="md">
            {filteredCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} data={candidate} />
            ))}
          </Flex>
        )}

        {!isLoading && candidatesQuery.isError && (
          <Center>
            <Text c="red">
              Failed to load candidates: {candidatesQuery.error.message}
            </Text>
          </Center>
        )}
      </Flex>
    </Container>
  );
}
