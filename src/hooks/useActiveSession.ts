const STORAGE_KEY = 'whatsapp_active_session';

function getStoredSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function useActiveSession(): {
  activeSessionId: string | null;
  saveActiveSession: (id: string) => void;
  clearActiveSession: () => void;
} {
  const activeSessionId = getStoredSessionId();

  function saveActiveSession(id: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  function clearActiveSession(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return { activeSessionId, saveActiveSession, clearActiveSession };
}
