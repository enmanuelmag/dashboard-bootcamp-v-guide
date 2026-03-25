export type Store = {
  statusFilter?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | null;
  theme: 'light' | 'dark';

  setStatusFilter: (
    status?: 'Pending' | 'Reviewing' | 'Interviewing' | 'Hired' | null,
  ) => void;
  setTheme: (newTheme: 'light' | 'dark') => void;
};
