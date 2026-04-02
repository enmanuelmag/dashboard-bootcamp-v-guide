export type Store = {
  statusFilter?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | null;
  theme: 'light' | 'dark';
  email?: string;

  setStatusFilter: (
    status?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | null,
  ) => void;
  setTheme: (newTheme: 'light' | 'dark') => void;
  setEmail: (email?: string) => void;
};
