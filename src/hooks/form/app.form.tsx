import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from '#/hooks/form/form-context';

import type { ButtonProps } from '@mantine/core';

import { Button, TextInput, NumberInput, Select } from '@mantine/core';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
    NumberInput,
    Select,
    Button,
  },
  formComponents: {
    SubmitButton: (props: ButtonProps) => (
      <Button {...props} loaderProps={{ type: 'dots' }} type="submit" />
    ),
  },
});
