import type { CandidateType, FormCandidateType } from '#/types/candidate';
import DataDS from './data-ds';

const CANDIDATES_KEY = 'candidates';

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

class LocalStorageDS extends DataDS {
  getData() {
    const candidatesRaw = localStorage.getItem(CANDIDATES_KEY) ?? '[]';
    return JSON.parse(candidatesRaw) as CandidateType[];
  }

  async getCandidates(status?: string) {
    try {
      // Simular latencia de red
      await sleep();

      const candidates = this.getData();

      // Filtrar por estado si se especificó
      return candidates.filter((candidate) => {
        if (status) {
          return candidate.status === status;
        }
        return true;
      });
    } catch (error) {
      console.error('Error loading candidates:', error);
      throw new Error('Error al cargar candidatos');
    }
  }

  async getCandidateById(id: string) {
    try {
      // Simular latencia de red
      await sleep();

      const candidates = this.getData();
      const candidate = candidates.find((c) => c.id === id);

      if (!candidate) {
        throw new Error('Candidate not found - invalid ID');
      }

      return candidate;
    } catch (error) {
      console.error('Error loading candidate by ID:', error);
      throw new Error('Error al cargar candidato por ID');
    }
  }

  async saveCandidate(candidate: FormCandidateType) {
    try {
      // Simular latencia de red
      await sleep();

      const candidates = this.getData();

      const newCandidate: CandidateType = {
        ...candidate,
        id: crypto.randomUUID(),
      };

      candidates.push(newCandidate);

      localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));

      return true;
    } catch (error) {
      console.error('Error saving candidate:', error);
      throw new Error('Error al guardar candidato');
    }
  }
}

export default LocalStorageDS;
