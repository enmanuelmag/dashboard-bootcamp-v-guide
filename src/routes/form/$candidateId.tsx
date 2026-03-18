import DataRepo from '#/api/datasource';
import type { FormCandidateType } from '#/types/candidate';
import { notifications } from '@mantine/notifications';
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Fieldset,
  NumberInput,
  Select,
  TextInput,
  Title,
} from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useSaveCandidateMutation } from '#/hooks/mutation/candidate';
import { isLoadingMutation } from '#/utils/queyr';
import { useCandidateByIdQuery } from '#/hooks/query/candidate';

export const Route = createFileRoute('/form/$candidateId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { candidateId } = Route.useParams();

  console.log('candidateId from params:', candidateId);

  const mode = candidateId === 'new' ? 'Creating' : 'Editing';

  const candidateByIdQuery = useCandidateByIdQuery(candidateId);

  const [form, setForm] = useState<FormCandidateType>({
    name: '',
    age: 18,
    experience: 0,
    skills: [],
    status: 'Pending',
    working: false,
  });

  const saveCandidateMutation = useSaveCandidateMutation();

  const isLoading = isLoadingMutation(saveCandidateMutation);

  React.useEffect(() => {
    if (candidateByIdQuery.isSuccess && candidateByIdQuery.data) {
      setForm(candidateByIdQuery.data);
    }
  }, [candidateByIdQuery.isSuccess, candidateByIdQuery.data]);

  return (
    <Container pt="md" pb="xl">
      <Title order={4}>{mode} candidate</Title>

      <Divider my="md" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Fieldset legend="Personal Information">
          <TextInput
            label="Name"
            placeholder="Type the name"
            value={form?.name || ''}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                name: e.currentTarget.value,
              }));
            }}
          />

          <NumberInput
            label="Age"
            placeholder="Type the age"
            min={18}
            value={form?.age || 0}
            onChange={(value) => {
              setForm((prev) => ({
                ...prev,
                age: Number(value),
              }));
            }}
          />
        </Fieldset>

        <Fieldset legend="Professional Information" mt="md">
          <NumberInput
            label="Experience"
            placeholder="Type the experience in years"
            value={form?.experience || 0}
            onChange={(value) => {
              setForm((prev) => ({
                ...prev,
                experience: Number(value),
              }));
            }}
          />

          <Select
            label="Status"
            placeholder="Select the status"
            clearable={false}
            allowDeselect={false}
            data={['Pending', 'Reviewing', 'Interviewing', 'Hired']}
            onChange={(value) => {
              if (!value) return;

              setForm((prev) => ({
                ...prev,
                status: value as FormCandidateType['status'],
              }));
            }}
          />

          <TextInput
            label="Skills"
            placeholder="Type the skills separated by commas"
            value={form?.skills?.join(', ') || ''}
            onChange={(e) => {
              const skills = e.currentTarget.value
                .split(',')
                .map((s) => s.trim());

              setForm((prev) => ({
                ...prev,
                skills,
              }));
            }}
          />

          <Checkbox
            mt="md"
            label="Currently Working"
            checked={form?.working || false}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                working: e.currentTarget.checked,
              }));
            }}
          />
        </Fieldset>

        <Button type="submit" mt="md" loading={isLoading}>
          Submit
        </Button>
      </form>
    </Container>
  );

  function handleSubmit() {
    console.log('Submitting form with data:', form);

    saveCandidateMutation.mutate(form);

    // DataRepo.saveCandidate(form)
    //   .then(() => {
    //     notifications.show({
    //       color: 'green',
    //       title: 'Éxito',
    //       message: 'Candidato guardado',
    //     });
    //   })
    //   .catch(() => {
    //     notifications.show({
    //       color: 'red',
    //       title: 'Error',
    //       message: 'No se pudo guardar el candidato',
    //     });
    //   });
  }
}
