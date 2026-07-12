import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import {
  GUIDE_SLUG,
  auth,
  db,
  firebaseEnabled,
  googleProvider,
} from "./firebase";

const STORAGE_KEY_CHECKED = "fftaProgress.checked";
const SAVE_DEBOUNCE_MS = 1000;

export type CheckedMap = Record<string, boolean>;
export type AuthStatus = "disabled" | "loading" | "signed-out" | "signed-in";
export type SyncStatus =
  | "local"
  | "loading-cloud"
  | "syncing"
  | "saved"
  | "issue"
  | "conflict";
export type SyncConflictChoice = "local" | "cloud" | "merge";

export type SyncConflict = {
  local: CheckedMap;
  cloud: CheckedMap;
  onlyLocal: string[];
  onlyCloud: string[];
};

type ProgressContextValue = {
  checked: CheckedMap;
  setCheck: (key: string, next?: boolean) => void;
  replaceChecked: (next: CheckedMap) => void;
  user: User | null;
  authStatus: AuthStatus;
  syncStatus: SyncStatus;
  authError: string | null;
  syncConflict: SyncConflict | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccountWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resolveSyncConflict: (choice: SyncConflictChoice) => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

const readLocalChecked = (): CheckedMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHECKED);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => value === true),
    ) as CheckedMap;
  } catch {
    return {};
  }
};

const normalizeChecked = (value: unknown): CheckedMap => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, checkedValue]) => typeof key === "string" && checkedValue === true,
    ),
  ) as CheckedMap;
};

const checkedKeys = (map: CheckedMap) =>
  Object.keys(map)
    .filter((key) => map[key])
    .sort();

const isEmptyChecked = (map: CheckedMap) => checkedKeys(map).length === 0;

const isSameChecked = (a: CheckedMap, b: CheckedMap) => {
  const aKeys = checkedKeys(a);
  const bKeys = checkedKeys(b);
  return aKeys.length === bKeys.length && aKeys.every((key, i) => key === bKeys[i]);
};

const unionChecked = (a: CheckedMap, b: CheckedMap): CheckedMap => {
  const next: CheckedMap = {};
  for (const key of checkedKeys(a)) next[key] = true;
  for (const key of checkedKeys(b)) next[key] = true;
  return next;
};

const diffChecked = (a: CheckedMap, b: CheckedMap) =>
  checkedKeys(a).filter((key) => !b[key]);

const userGuideDoc = (uid: string) => {
  if (!db) throw new Error("Firebase is not configured.");
  return doc(db, "users", uid, "guides", GUIDE_SLUG);
};

const cloudCheckedFromDoc = (data: DocumentData | undefined): CheckedMap => {
  if (!data || data.guideSlug !== GUIDE_SLUG || data.schemaVersion !== 1) return {};
  return normalizeChecked(data.checked);
};

const toUserMessage = (error: unknown) => {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/email-already-in-use":
      return "That email already has an account.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email or password was not accepted.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before it finished.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return "Authentication failed. Please try again.";
  }
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState<CheckedMap>(() => readLocalChecked());
  const [user, setUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(
    firebaseEnabled ? "loading" : "disabled",
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    firebaseEnabled ? "local" : "local",
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [syncConflict, setSyncConflict] = useState<SyncConflict | null>(null);
  const [cloudReady, setCloudReady] = useState(false);
  const conflictRef = useRef<SyncConflict | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const latestCheckedRef = useRef(checked);

  useEffect(() => {
    latestCheckedRef.current = checked;
    try {
      localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(checked));
    } catch {
      setSyncStatus((current) => (user ? "issue" : current));
    }
  }, [checked, user]);

  const writeCloud = useCallback(async (uid: string, map: CheckedMap) => {
    if (!firebaseEnabled || !db) return;
    setSyncStatus("syncing");
    await setDoc(userGuideDoc(uid), {
      checked: normalizeChecked(map),
      guideSlug: GUIDE_SLUG,
      schemaVersion: 1,
      updatedAt: serverTimestamp(),
    });
    setSyncStatus("saved");
  }, []);

  const applyChosenProgress = useCallback(
    async (uid: string, next: CheckedMap, shouldWriteCloud: boolean) => {
      setSyncConflict(null);
      conflictRef.current = null;
      setChecked(next);
      setCloudReady(true);
      if (shouldWriteCloud) {
        await writeCloud(uid, next);
      } else {
        setSyncStatus("saved");
      }
    },
    [writeCloud],
  );

  useEffect(() => {
    if (!firebaseEnabled || !auth) return undefined;

    return onAuthStateChanged(auth, async (nextUser) => {
      setAuthError(null);
      setUser(nextUser);
      setCloudReady(false);
      setSyncConflict(null);
      conflictRef.current = null;

      if (!nextUser) {
        setAuthStatus("signed-out");
        setSyncStatus("local");
        return;
      }

      setAuthStatus("signed-in");
      setSyncStatus("loading-cloud");

      try {
        const local = latestCheckedRef.current;
        const snapshot = await getDoc(userGuideDoc(nextUser.uid));
        const cloud = cloudCheckedFromDoc(snapshot.data());
        const localEmpty = isEmptyChecked(local);
        const cloudEmpty = isEmptyChecked(cloud);

        if (localEmpty && !cloudEmpty) {
          await applyChosenProgress(nextUser.uid, cloud, false);
          return;
        }

        if (!localEmpty && cloudEmpty) {
          await applyChosenProgress(nextUser.uid, local, true);
          return;
        }

        if (isSameChecked(local, cloud)) {
          await applyChosenProgress(nextUser.uid, local, false);
          return;
        }

        const conflict = {
          local,
          cloud,
          onlyLocal: diffChecked(local, cloud),
          onlyCloud: diffChecked(cloud, local),
        };
        conflictRef.current = conflict;
        setSyncConflict(conflict);
        setSyncStatus("conflict");
      } catch {
        setSyncStatus("issue");
      }
    });
  }, [applyChosenProgress]);

  useEffect(() => {
    if (!user || !cloudReady || syncConflict || !firebaseEnabled) return undefined;

    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(() => {
      void writeCloud(user.uid, latestCheckedRef.current).catch(() => {
        setSyncStatus("issue");
      });
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [checked, cloudReady, syncConflict, user, writeCloud]);

  const setCheck = useCallback((key: string, next?: boolean) => {
    setChecked((previous) => {
      const value = next ?? !previous[key];
      const updated = { ...previous };
      if (value) {
        updated[key] = true;
      } else {
        delete updated[key];
      }
      return updated;
    });
  }, []);

  const replaceChecked = useCallback((next: CheckedMap) => {
    setChecked(normalizeChecked(next));
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!auth) {
      setAuthError("Firebase is not configured for this build.");
      return;
    }
    try {
      setAuthError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(toUserMessage(error));
      throw error;
    }
  }, []);

  const createAccountWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!auth) {
        setAuthError("Firebase is not configured for this build.");
        return;
      }
      try {
        setAuthError(null);
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setAuthError(toUserMessage(error));
        throw error;
      }
    },
    [],
  );

  const resetPassword = useCallback(async (email: string) => {
    if (!auth) {
      setAuthError("Firebase is not configured for this build.");
      return;
    }
    try {
      setAuthError(null);
      await sendPasswordResetEmail(auth, email);
      setAuthError("Password reset email sent if the account exists.");
    } catch (error) {
      setAuthError(toUserMessage(error));
      throw error;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth || !googleProvider) {
      setAuthError("Firebase is not configured for this build.");
      return;
    }
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError(toUserMessage(error));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    setAuthError(null);
    await firebaseSignOut(auth);
  }, []);

  const resolveSyncConflict = useCallback(
    async (choice: SyncConflictChoice) => {
      if (!user || !conflictRef.current) return;
      const conflict = conflictRef.current;
      const next =
        choice === "local"
          ? conflict.local
          : choice === "cloud"
            ? conflict.cloud
            : unionChecked(conflict.local, conflict.cloud);

      await applyChosenProgress(user.uid, next, choice !== "cloud");
    },
    [applyChosenProgress, user],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      checked,
      setCheck,
      replaceChecked,
      user,
      authStatus,
      syncStatus,
      authError,
      syncConflict,
      signInWithEmail,
      createAccountWithEmail,
      resetPassword,
      signInWithGoogle,
      signOut,
      resolveSyncConflict,
    }),
    [
      checked,
      setCheck,
      replaceChecked,
      user,
      authStatus,
      syncStatus,
      authError,
      syncConflict,
      signInWithEmail,
      createAccountWithEmail,
      resetPassword,
      signInWithGoogle,
      signOut,
      resolveSyncConflict,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
};
