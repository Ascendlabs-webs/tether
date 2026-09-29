import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { User, Moment, VaultMemory, IdeaItem, Couple } from '../types/tether';

/**
 * Removes any undefined properties or nested undefined values from an object,
 * as Firestore strictly disallows undefined in document payloads.
 */
function cleanUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined) as any;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanUndefined(value);
      }
    }
    return cleaned as any;
  }
  return obj;
}

export class DbService {
  // Sync a user profile / vibe / focus state to Firestore
  static async saveUser(user: User): Promise<void> {
    const path = `users/${user.id}`;
    try {
      const data = cleanUndefined({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        isPremium: user.isPremium,
        tier: user.tier,
        currentVibe: user.currentVibe,
        vibeUpdatedAt: user.vibeUpdatedAt,
        isInFocusMode: user.isInFocusMode,
        focusModeReason: user.focusModeReason || '',
      });
      await setDoc(doc(db, 'users', user.id), data, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  // Subscribe to real-time user updates
  static subscribeUsers(onUpdate: (usersMap: Record<string, User>) => void): () => void {
    const path = 'users';
    try {
      const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
        const users: Record<string, User> = {};
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          users[d.id] = {
            id: d.id,
            name: d.name || 'Partner',
            avatar: d.avatar || '',
            email: d.email || '',
            isPremium: Boolean(d.isPremium),
            tier: d.tier || 'free',
            currentVibe: d.currentVibe || 'thinking_of_you',
            vibeUpdatedAt: d.vibeUpdatedAt || new Date().toISOString(),
            isInFocusMode: Boolean(d.isInFocusMode),
            focusModeReason: d.focusModeReason || undefined,
          };
        });
        if (Object.keys(users).length > 0) {
          onUpdate(users);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, path);
      });
      return unsub;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }

  // Save couple record
  static async saveCouple(couple: Couple): Promise<void> {
    const path = `couples/${couple.id}`;
    try {
      const data = cleanUndefined({
        id: couple.id,
        partnerAId: couple.partnerA.id,
        partnerBId: couple.partnerB.id,
        pairingCode: couple.pairingCode,
        createdAt: couple.createdAt,
        anniversaryDate: couple.anniversaryDate || '',
      });
      await setDoc(doc(db, 'couples', couple.id), data, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  // Save moment to Firestore
  static async saveMoment(coupleId: string, moment: Moment): Promise<void> {
    const path = `couples/${coupleId}/moments/${moment.id}`;
    try {
      const data = cleanUndefined({
        id: moment.id,
        coupleId: coupleId,
        senderId: moment.senderId,
        senderName: moment.senderName,
        senderAvatar: moment.senderAvatar,
        mediaType: moment.mediaType,
        mediaUrl: moment.mediaUrl,
        caption: moment.caption || '',
        durationSeconds: moment.durationSeconds ?? null,
        audioWaveform: moment.audioWaveform ?? [],
        createdAt: moment.createdAt,
        expiresAt: moment.expiresAt,
        isSavedToVault: Boolean(moment.isSavedToVault),
        isLocked: Boolean(moment.isLocked),
      });
      await setDoc(doc(db, 'couples', coupleId, 'moments', moment.id), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  // Real-time listener for moments
  static subscribeMoments(coupleId: string, onUpdate: (moments: Moment[]) => void): () => void {
    const path = `couples/${coupleId}/moments`;
    try {
      const unsub = onSnapshot(collection(db, 'couples', coupleId, 'moments'), (snapshot) => {
        const list: Moment[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: d.id,
            coupleId: d.coupleId,
            senderId: d.senderId,
            senderName: d.senderName,
            senderAvatar: d.senderAvatar,
            mediaType: d.mediaType,
            mediaUrl: d.mediaUrl,
            caption: d.caption || undefined,
            durationSeconds: d.durationSeconds || undefined,
            audioWaveform: d.audioWaveform || undefined,
            createdAt: d.createdAt,
            expiresAt: d.expiresAt,
            isSavedToVault: Boolean(d.isSavedToVault),
            isLocked: Boolean(d.isLocked),
          });
        });
        // Sort descending by creation
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, path);
      });
      return unsub;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }

  // Update moment lock or vault state
  static async updateMoment(coupleId: string, momentId: string, fields: Partial<Moment>): Promise<void> {
    const path = `couples/${coupleId}/moments/${momentId}`;
    try {
      await updateDoc(doc(db, 'couples', coupleId, 'moments', momentId), cleanUndefined(fields));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  // Save vault memory
  static async saveVaultMemory(coupleId: string, memory: VaultMemory): Promise<void> {
    const path = `couples/${coupleId}/vault/${memory.id}`;
    try {
      const cleanMoment = {
        id: memory.moment.id,
        coupleId: memory.moment.coupleId,
        senderId: memory.moment.senderId,
        senderName: memory.moment.senderName,
        senderAvatar: memory.moment.senderAvatar,
        mediaType: memory.moment.mediaType,
        mediaUrl: memory.moment.mediaUrl,
        caption: memory.moment.caption || '',
        durationSeconds: memory.moment.durationSeconds ?? null,
        audioWaveform: memory.moment.audioWaveform ?? [],
        createdAt: memory.moment.createdAt,
        expiresAt: memory.moment.expiresAt,
        isSavedToVault: Boolean(memory.moment.isSavedToVault),
        isLocked: Boolean(memory.moment.isLocked),
      };

      const data = cleanUndefined({
        id: memory.id,
        coupleId: coupleId,
        momentId: memory.momentId,
        moment: cleanMoment,
        savedAt: memory.savedAt,
        savedBy: memory.savedBy,
        note: memory.note || '',
      });
      await setDoc(doc(db, 'couples', coupleId, 'vault', memory.id), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  // Real-time listener for vault
  static subscribeVault(coupleId: string, onUpdate: (vault: VaultMemory[]) => void): () => void {
    const path = `couples/${coupleId}/vault`;
    try {
      const unsub = onSnapshot(collection(db, 'couples', coupleId, 'vault'), (snapshot) => {
        const list: VaultMemory[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: d.id,
            coupleId: d.coupleId,
            momentId: d.momentId,
            moment: d.moment,
            savedAt: d.savedAt,
            savedBy: d.savedBy,
            note: d.note || undefined,
          });
        });
        list.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        onUpdate(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, path);
      });
      return unsub;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }

  // Delete from vault
  static async deleteVaultMemory(coupleId: string, vaultId: string): Promise<void> {
    const path = `couples/${coupleId}/vault/${vaultId}`;
    try {
      await deleteDoc(doc(db, 'couples', coupleId, 'vault', vaultId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  // Save idea
  static async saveIdea(coupleId: string, idea: IdeaItem): Promise<void> {
    const path = `couples/${coupleId}/ideas/${idea.id}`;
    try {
      const data = cleanUndefined({
        id: idea.id,
        coupleId: coupleId,
        title: idea.title,
        note: idea.note || '',
        category: idea.category,
        createdBy: idea.createdBy,
        createdByName: idea.createdByName,
        createdAt: idea.createdAt,
        isCompleted: Boolean(idea.isCompleted),
      });
      await setDoc(doc(db, 'couples', coupleId, 'ideas', idea.id), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  // Real-time listener for ideas
  static subscribeIdeas(coupleId: string, onUpdate: (ideas: IdeaItem[]) => void): () => void {
    const path = `couples/${coupleId}/ideas`;
    try {
      const unsub = onSnapshot(collection(db, 'couples', coupleId, 'ideas'), (snapshot) => {
        const list: IdeaItem[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: d.id,
            coupleId: d.coupleId,
            title: d.title,
            note: d.note || undefined,
            category: d.category,
            createdBy: d.createdBy,
            createdByName: d.createdByName,
            createdAt: d.createdAt,
            isCompleted: Boolean(d.isCompleted),
          });
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, path);
      });
      return unsub;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
    }
  }

  // Toggle idea completion
  static async updateIdea(coupleId: string, ideaId: string, fields: Partial<IdeaItem>): Promise<void> {
    const path = `couples/${coupleId}/ideas/${ideaId}`;
    try {
      await updateDoc(doc(db, 'couples', coupleId, 'ideas', ideaId), cleanUndefined(fields));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  }

  // Delete idea
  static async deleteIdea(coupleId: string, ideaId: string): Promise<void> {
    const path = `couples/${coupleId}/ideas/${ideaId}`;
    try {
      await deleteDoc(doc(db, 'couples', coupleId, 'ideas', ideaId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }

  // Seed initial data if database is empty
  static async seedInitialDataIfEmpty(
    defaultUsers: Record<string, User>,
    defaultCouple: Couple,
    defaultMoments: Moment[],
    defaultVault: VaultMemory[],
    defaultIdeas: IdeaItem[]
  ): Promise<void> {
    try {
      const momentsSnap = await getDocs(collection(db, 'couples', defaultCouple.id, 'moments'));
      if (momentsSnap.empty) {
        console.log('Seeding initial couple data to Cloud Firestore...');
        // Save users
        for (const user of Object.values(defaultUsers)) {
          await this.saveUser(user);
        }
        // Save couple
        await this.saveCouple(defaultCouple);
        // Save initial moments
        for (const m of defaultMoments) {
          await this.saveMoment(defaultCouple.id, m);
        }
        // Save initial vault
        for (const v of defaultVault) {
          await this.saveVaultMemory(defaultCouple.id, v);
        }
        // Save initial ideas
        for (const i of defaultIdeas) {
          await this.saveIdea(defaultCouple.id, i);
        }
        console.log('Initial couple data successfully seeded to Cloud Firestore.');
      }
    } catch (err) {
      console.warn('Seeding check note:', err);
    }
  }
}
