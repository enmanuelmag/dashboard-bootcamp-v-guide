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

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';

import DataDS from './data-ds';
import { firebaseDB, auth } from '#/integrations/firebase';
import { queryClient } from '#/integrations/query/provider';
import { QKeys } from '#/const/keys';
import type {
  EmailAndPasswordLoginType,
  EmailAndPasswordRegisterFormType,
} from '#/types/auth';

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
        deleted: false,
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

  async toggleWorking(id: string, newWorkingValue: boolean) {
    try {
      const docRef = doc(firebaseDB, CANDIDATES_COL, id);

      await updateDoc(docRef, {
        working: newWorkingValue,
      });

      await queryClient.invalidateQueries({
        queryKey: QKeys.GET_CANDIDATE_BY_ID(id),
      });

      return newWorkingValue;
    } catch (error) {
      console.log('Error al actualizar el working field');
      throw error;
    }
  }

  async registerWithEmailAndPassword(params: EmailAndPasswordRegisterFormType) {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        params.email,
        params.password,
      );
      const { user } = result;
      return {
        id: user.uid,
        email: user.email!,
        name: user.displayName || 'No name',
      };
    } catch (error) {
      console.error('Error en registro', error);
      throw error;
    }
  }

  async loginWithEmailAndPassword(params: EmailAndPasswordLoginType) {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        params.email,
        params.password,
      );
      const { user } = result;
      return {
        id: user.uid,
        email: user.email!,
        name: user.displayName || 'No name',
      };
    } catch (error) {
      console.error('Error en login', error);
      throw error;
    }
  }

  async loginWithGoogle() {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      return {
        id: user.uid,
        email: user.email!,
        name: user.displayName || 'No name',
      };
    } catch (error) {
      console.error('Error en login con Google', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logout', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const result = await new Promise<User | null>((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            resolve(user);
          } else {
            resolve(null);
          }
        });
      });

      if (!result) {
        return null;
      }

      return {
        id: result.uid,
        email: result.email!,
        name: result.displayName || 'No name',
      };
    } catch (error) {
      console.error('Error al obtener usuario actual', error);
      throw error;
    }
  }
}
