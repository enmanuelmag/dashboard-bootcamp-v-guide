import type { CandidateType, FormCandidateType } from '#/types/candidate';

abstract class DataDS {
  abstract getCandidates(status?: string): Promise<Array<CandidateType>>;

  abstract getCandidateById(id: string): Promise<CandidateType>;

  abstract saveCandidate(candidate: FormCandidateType): Promise<boolean>;
}

export default DataDS;
