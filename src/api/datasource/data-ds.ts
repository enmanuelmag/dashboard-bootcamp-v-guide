import type {
  CandidateType,
  FormCandidateType,
  UpdateCandidateType,
} from '#/types/candidate';

abstract class DataDS {
  abstract getCandidates(status?: string | null): Promise<Array<CandidateType>>;

  abstract getCandidateById(id: string): Promise<CandidateType>;

  abstract saveCandidate(candidate: FormCandidateType): Promise<boolean>;

  abstract updateCandidate(candidate: UpdateCandidateType): Promise<string>;

  abstract deleteCandidate(id: string): Promise<boolean>;
}

export default DataDS;
