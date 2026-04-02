import DataRepo from '#/api/datasource';
import { auth } from '#/integrations/firebase';
import { useAppStore } from '#/store';
import type {
  EmailAndPasswordLoginType,
  EmailAndPasswordRegisterFormType,
  UserType,
} from '#/types/auth';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const setEmail = useAppStore((s) => s.setEmail);
  return useMutation({
    mutationFn: async (params: EmailAndPasswordRegisterFormType) => {
      return await DataRepo.registerWithEmailAndPassword(params);
    },
    onSuccess: (data) => {
      setEmail(data.email);
      navigate({
        to: '/candidates',
      });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error al crear usuario',
      });
    },
  });
};

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setEmail = useAppStore((s) => s.setEmail);
  return useMutation({
    mutationFn: async (params: EmailAndPasswordLoginType) => {
      return await DataRepo.loginWithEmailAndPassword(params);
    },
    onSuccess: (data) => {
      setEmail(data.email);
      navigate({
        to: '/candidates',
      });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error al iniciar usuario',
      });
    },
  });
};

export const useGoogleLoginMutation = () => {
  const navigate = useNavigate();
  const setEmail = useAppStore((s) => s.setEmail);
  return useMutation({
    mutationFn: async () => {
      return await DataRepo.loginWithGoogle();
    },
    onSuccess: (data) => {
      setEmail(data.email);
      navigate({
        to: '/candidates',
      });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error al iniciar usuario',
      });
    },
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const setEmail = useAppStore((s) => s.setEmail);
  return useMutation({
    mutationFn: async () => {
      return await DataRepo.logout();
    },
    onSuccess: () => {
      setEmail(undefined);
      navigate({
        to: '/',
      });
    },
    onError: () => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Error al cerrar sesión',
      });
    },
  });
};

export const useGetUser = () => {
  const [user, setUser] = React.useState<UserType | null>(null);

  React.useLayoutEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          id: user?.uid || '',
          email: user?.email || '',
          name: user?.displayName || '',
        });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return user;
};
