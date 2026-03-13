export const QKeys = {
  // CANDIDATES
  GET_CANDIDATES: ['candidates'],
  GET_CANDIDATES_BY_STATUS: (status?: string | null) => [
    'candidates',
    { status },
  ],
  GET_CANDIDATE_BY_ID: (id: string) => ['candidates', id],
};
