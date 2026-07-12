import { useId, useMemo, useState, type FormEvent } from "react";
import {
  Cloud,
  HelpCircle,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { firebaseEnabled } from "./firebase";
import { useProgress, type SyncConflictChoice } from "./progress";

export type ProgressKeyLabel = {
  category: string;
  item: string;
  subItem?: string;
};

export type ProgressKeyFormatter = (key: string) => ProgressKeyLabel;

type AuthSyncControlProps = {
  formatProgressKey: ProgressKeyFormatter;
};

const statusLabels = {
  local: "Progress saved locally",
  "loading-cloud": "Loading cloud progress",
  syncing: "Syncing to cloud",
  saved: "Cloud progress saved",
  issue: "Cloud sync issue",
  conflict: "Choose progress source",
} as const;

const countChecked = (map: Record<string, boolean>) =>
  Object.values(map).filter(Boolean).length;

const formatLabel = (label: ProgressKeyLabel) =>
  label.subItem
    ? `${label.category}: ${label.item} - ${label.subItem}`
    : `${label.category}: ${label.item}`;

function DifferenceList({
  title,
  keys,
  formatProgressKey,
}: {
  title: string;
  keys: string[];
  formatProgressKey: ProgressKeyFormatter;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </div>
      {keys.length === 0 ? (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">None.</p>
      ) : (
        <ul className="mt-1 max-h-40 space-y-1 overflow-auto pr-1 text-sm text-zinc-700 dark:text-zinc-200">
          {keys.map((key) => (
            <li key={key} className="rounded-md bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
              {formatLabel(formatProgressKey(key))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SyncConflictDialog({
  formatProgressKey,
}: {
  formatProgressKey: ProgressKeyFormatter;
}) {
  const { syncConflict, resolveSyncConflict } = useProgress();
  const [showDifferences, setShowDifferences] = useState(false);
  const [busyChoice, setBusyChoice] = useState<SyncConflictChoice | null>(null);

  if (!syncConflict) return null;

  const localCount = countChecked(syncConflict.local);
  const cloudCount = countChecked(syncConflict.cloud);
  const mergeCount = new Set([
    ...Object.keys(syncConflict.local).filter((key) => syncConflict.local[key]),
    ...Object.keys(syncConflict.cloud).filter((key) => syncConflict.cloud[key]),
  ]).size;

  const choose = async (choice: SyncConflictChoice) => {
    setBusyChoice(choice);
    try {
      await resolveSyncConflict(choice);
    } finally {
      setBusyChoice(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-zinc-950/10 dark:bg-zinc-900 dark:ring-white/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-conflict-title"
      >
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            <h2
              id="progress-conflict-title"
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Choose progress source
            </h2>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Local and cloud progress both exist and differ. Syncing is paused until
            you choose.
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => void choose("local")}
              className="rounded-lg border border-zinc-300 px-3 py-3 text-left text-sm transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/15 dark:hover:bg-zinc-800"
            >
              <span className="block font-semibold text-zinc-900 dark:text-zinc-100">
                Use Local
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {busyChoice === "local" ? "Applying..." : `${localCount} checked`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => void choose("cloud")}
              className="rounded-lg border border-zinc-300 px-3 py-3 text-left text-sm transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/15 dark:hover:bg-zinc-800"
            >
              <span className="block font-semibold text-zinc-900 dark:text-zinc-100">
                Use Cloud
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {busyChoice === "cloud" ? "Applying..." : `${cloudCount} checked`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => void choose("merge")}
              className="rounded-lg border border-blue-500 bg-blue-50 px-3 py-3 text-left text-sm transition hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-950/40 dark:hover:bg-blue-950/60"
            >
              <span className="block font-semibold text-blue-900 dark:text-blue-100">
                Merge Both
              </span>
              <span className="text-blue-700 dark:text-blue-200">
                {busyChoice === "merge" ? "Applying..." : `${mergeCount} checked`}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowDifferences((open) => !open)}
            className="text-sm font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300"
          >
            {showDifferences ? "Hide differences" : "Show differences"}
          </button>

          {showDifferences && (
            <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-4 dark:border-white/10 sm:grid-cols-2">
              <DifferenceList
                title="Only local"
                keys={syncConflict.onlyLocal}
                formatProgressKey={formatProgressKey}
              />
              <DifferenceList
                title="Only cloud"
                keys={syncConflict.onlyCloud}
                formatProgressKey={formatProgressKey}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuthSyncControl({ formatProgressKey }: AuthSyncControlProps) {
  const {
    user,
    authStatus,
    syncStatus,
    authError,
    signInWithEmail,
    createAccountWithEmail,
    resetPassword,
    signInWithGoogle,
    signOut,
  } = useProgress();
  const [open, setOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const dialogTitleId = useId();
  const tooltipId = useId();

  const mainLabel = user?.email || "Progress saved locally";
  const statusText = user ? statusLabels[syncStatus] : "Progress saved locally";
  const signedInTooltip =
    "Signed-in progress is synced to Firebase under your account. Firestore security rules restrict each user to their own guide progress.";
  const signedOutTooltip =
    "Progress is saved locally in this browser by default. Sign in to sync progress to your account through Firebase.";

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.length >= 6 && firebaseEnabled,
    [email, password],
  );

  const submitEmail = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    try {
      if (createMode) {
        await createAccountWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
      setOpen(false);
    } catch {
      // The shared auth state exposes compact user-facing errors.
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!email.trim() || !firebaseEnabled) return;
    setBusy(true);
    try {
      await resetPassword(email.trim());
    } catch {
      // The shared auth state exposes compact user-facing errors.
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    if (!firebaseEnabled) return;
    setBusy(true);
    try {
      await signInWithGoogle();
      setOpen(false);
    } catch {
      // The shared auth state exposes compact user-facing errors.
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="relative flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
        <div className="flex min-w-0 items-center gap-2">
          <div className="group relative min-w-0">
            <button
              type="button"
              className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/25 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-describedby={tooltipId}
            >
              {user ? (
                <ShieldCheck className="h-4 w-4 shrink-0" />
              ) : (
                <HelpCircle className="h-4 w-4 shrink-0" />
              )}
              <span className="truncate">{mainLabel}</span>
            </button>
            <div
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full z-20 mt-2 hidden w-72 rounded-lg bg-zinc-950 px-3 py-2 text-left text-xs leading-relaxed text-white shadow-lg group-hover:block group-focus-within:block"
            >
              {user ? signedInTooltip : signedOutTooltip}
            </div>
          </div>

          {user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <UserRound className="h-4 w-4" />
              Sign in
            </button>
          )}
        </div>
        <div className="text-right text-xs text-white/80">{statusText}</div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl ring-1 ring-zinc-950/10 dark:bg-zinc-900 dark:ring-white/10"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-white/10">
              <div>
                <h2
                  id={dialogTitleId}
                  className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  Sign in
                </h2>
                <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                  Sync progress through Firebase.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                aria-label="Close sign-in dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={(event) => void submitEmail(event)} className="space-y-3 px-5 py-4">
              {!firebaseEnabled && (
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-900/60">
                  Firebase env vars are not configured in this build. Local progress still works.
                </div>
              )}
              {authError && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-900 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:ring-rose-900/60">
                  {authError}
                </div>
              )}
              <label className="block text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-200">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-200">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={createMode ? "new-password" : "current-password"}
                  minLength={6}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-100"
                />
                <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                  Minimum 6 characters.
                </span>
              </label>

              <button
                type="submit"
                disabled={!canSubmit || busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
                {busy ? "Please wait..." : createMode ? "Create account" : "Sign in with email"}
              </button>

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setCreateMode((next) => !next)}
                  className="font-medium text-blue-700 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300"
                >
                  {createMode ? "Use existing account" : "Create account"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleReset()}
                  disabled={!email.trim() || busy || !firebaseEnabled}
                  className="font-medium text-zinc-600 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300 dark:hover:text-white"
                >
                  Reset password
                </button>
              </div>
            </form>

            <div className="space-y-3 border-t border-zinc-200 px-5 py-4 dark:border-white/10">
              <button
                type="button"
                onClick={() => void handleGoogle()}
                disabled={busy || !firebaseEnabled}
                className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              {authStatus === "disabled" && (
                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                  This build is using browser-only progress storage.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <SyncConflictDialog formatProgressKey={formatProgressKey} />
    </>
  );
}
