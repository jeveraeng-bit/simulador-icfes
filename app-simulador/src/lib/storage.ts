import { ExamSessionLog, UserProfile } from '@/types';

const LOGS_STORAGE_KEY = 'icfes_simulador_user_logs';
const USER_PROFILE_KEY = 'icfes_simulador_user_profile';

export const DEFAULT_USER: UserProfile = {
  id: 'usr_juan_esteban_vera',
  name: 'Juan Esteban Vera Rodríguez',
  email: 'juan.vera@uan.edu.co',
  role: 'ESTUDIANTE',
  plan: 'PRO',
  targetExam: 'SABER_11',
  institutionCode: 'Universidad Antonio Nariño — Sede Ibagué (Ingeniería Electrónica)',
};

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

export function updateUserProfile(profile: Partial<UserProfile>): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER;
  try {
    const current = getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_USER;
  }
}

export function saveSessionLog(sessionLog: ExamSessionLog): void {
  if (typeof window === 'undefined') return;
  try {
    const currentLogs = getSessionLogs();
    const updated = [sessionLog, ...currentLogs.filter((l) => l.id !== sessionLog.id)];
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving session log', err);
  }
}

export function getSessionLogs(): ExamSessionLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getSessionLogById(id: string): ExamSessionLog | null {
  const logs = getSessionLogs();
  return logs.find((l) => l.id === id) || null;
}
