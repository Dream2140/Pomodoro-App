import {
  ref,
  get,
  update,
  remove,
} from 'firebase/database';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, database } from '@/config/firebase';
import type { Task, PomodoroSettings } from '@/types';

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function registerUser(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function getUserTasks(userId: string): Promise<Record<string, Task> | null> {
  const snapshot = await get(ref(database, `users/${userId}/tasks`));
  return snapshot.val();
}

export async function saveTask(userId: string, task: Task) {
  await update(ref(database, `users/${userId}/tasks`), { [task.id]: task });
}

export async function removeTask(userId: string, taskId: string) {
  await remove(ref(database, `users/${userId}/tasks/${taskId}`));
}

export async function getUserSettings(userId: string): Promise<PomodoroSettings | null> {
  const snapshot = await get(ref(database, `users/${userId}/settings`));
  return snapshot.val();
}

export async function saveSettings(userId: string, settings: PomodoroSettings) {
  await update(ref(database, `users/${userId}`), { settings });
}

export async function getDefaultSettings(): Promise<PomodoroSettings | null> {
  const snapshot = await get(ref(database, 'defaultSettings'));
  return snapshot.val();
}
