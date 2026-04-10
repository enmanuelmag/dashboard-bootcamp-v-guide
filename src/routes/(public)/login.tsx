import { useAppForm } from '#/hooks/form/app.form';
import {
  useGoogleLoginMutation,
  useLoginMutation,
} from '#/hooks/mutation/auth';
import {
  EmailAndPasswordLoginSchema,
  type EmailAndPasswordLoginType,
} from '#/types/auth';
import {
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextInput,
} from '@mantine/core';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)/login')({
  component: RouteComponent,
});

const initial: EmailAndPasswordLoginType = {
  email: '',
  password: '',
};

function RouteComponent() {
  const loginMutation = useLoginMutation();

  const googleLoginMutation = useGoogleLoginMutation();

  const form = useAppForm({
    defaultValues: initial,
    validators: {
      onSubmit: EmailAndPasswordLoginSchema,
    },
    onSubmit: (params) => {
      console.log('Submit', params.value);
      loginMutation.mutate(params.value);
    },
    onSubmitInvalid: (form) => {
      console.log('Invalid form', form.formApi.getAllErrors());
    },
  });

  const isLoading = loginMutation.isPending || googleLoginMutation.isPending;

  return (
    <Container>
      <Paper shadow="md" p="md" withBorder mt="xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
        >
          <form.AppField
            name="email"
            children={(field) => (
              <TextInput
                label="Email"
                type="email"
                value={field.state.value}
                error={field.state.meta.errors.at(0)?.message}
                onChange={(e) => field.handleChange(e.currentTarget.value)}
              />
            )}
          />
          <form.AppField
            name="password"
            children={(field) => (
              <TextInput
                label="Password"
                type="password"
                value={field.state.value}
                error={field.state.meta.errors.at(0)?.message}
                onChange={(e) => field.handleChange(e.currentTarget.value)}
              />
            )}
          />

          <Stack mt="xl" gap="xs">
            <Button
              color="red"
              loading={isLoading}
              onClick={() => {
                googleLoginMutation.mutate();
              }}
            >
              Iniciar con Google
            </Button>

            <form.SubmitButton loading={isLoading}>Login</form.SubmitButton>
          </Stack>
        </form>

        <Divider my="md" />

        <Link to="/register">
          <Button variant="light" fullWidth>
            Register
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}
