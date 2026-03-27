import type {
  CandidateType,
  FormCandidateType,
  UpdateCandidateType,
} from '#/types/candidate';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import DataDS from './data-ds';
import { firebaseDB } from '#/integrations/firebase';

const CANDIDATES_COL = 'candidates-v1';

export default class FirestoreDS extends DataDS {
  async getCandidates(status?: string | null) {
    try {
      console.log('Loading candidates from FirestoreDS with status:', status);

      const candidatesRef = collection(firebaseDB, CANDIDATES_COL);

      const filters: Array<QueryFieldFilterConstraint> = [];

      if (status) {
        filters.push(where('status', '==', status));
      }

      filters.push(where('deleted', '!=', true));

      const q = query(candidatesRef, ...filters);

      const snapCol = await getDocs(q);

      if (snapCol.empty) {
        console.log('Colección vacía');
        return [];
      }

      const candidates = snapCol.docs.map((docRef) =>
        docRef.data(),
      ) as CandidateType[];

      return candidates;
    } catch (error) {
      console.error('Error firebase', error);
      throw new Error('Error al obtener los documentos');
    }
  }

  async getCandidateById(id: string) {
    try {
      const candidateRef = doc(firebaseDB, CANDIDATES_COL, id);

      const snap = await getDoc(candidateRef);

      if (!snap.exists()) {
        throw new Error('Candidato no existe');
      }

      const candidato = snap.data() as CandidateType;

      return candidato;
    } catch (error) {
      console.error('Error obtener candidato', error);
      throw new Error('Error al obtener candidato');
    }
  }

  async saveCandidate(candidate: FormCandidateType) {
    try {
      const id = crypto.randomUUID();

      const newCandidate: CandidateType = {
        ...candidate,
        id,
      };

      const candidateRef = doc(firebaseDB, CANDIDATES_COL, newCandidate.id);

      await setDoc(candidateRef, newCandidate);

      return true;
    } catch (error) {
      console.error('Error al crear candidato', error);
      throw new Error('Error al crear candidato');
    }
  }

  async updateCandidate(candidate: UpdateCandidateType) {
    try {
      const candidateRef = doc(firebaseDB, CANDIDATES_COL, candidate.id);

      await updateDoc(candidateRef, candidate);

      return candidate.id;
    } catch (error) {
      console.error('Error al crear candidato', error);
      throw new Error('Error al crear candidato');
    }
  }

  async deleteCandidate(id: string) {
    try {
      const candidateRef = doc(firebaseDB, CANDIDATES_COL, id);

      await updateDoc(candidateRef, {
        deleted: true,
      });

      return true;
    } catch (error) {
      console.error('Error al crear candidato', error);
      throw new Error('Error al crear candidato');
    }
  }
}
