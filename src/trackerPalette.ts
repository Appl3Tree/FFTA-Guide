export type TrackerColor = "blue" | "emerald" | "gold" | "red" | "teal" | "copper" | "slate" | "violet" | "amber";

export const TRACKER_COLOR = {
  blueMagic: "blue",
  captures: "emerald",
  missions: "gold",
  missables: "red",
  recommended: "teal",
  conditional: "copper",
  optional: "slate",
  mapPlacements: "violet",
  sidequests: "amber",
} as const satisfies Record<string, TrackerColor>;

export const ACQUISITION_TRACKER_COLOR = {
  permanent: TRACKER_COLOR.missables,
  recommended: TRACKER_COLOR.recommended,
  conditional: TRACKER_COLOR.conditional,
  optional: TRACKER_COLOR.optional,
} as const;

export const TRACKER_PALETTE: Record<TrackerColor, {
  badge: string;
  text: string;
  border: string;
  cardBorder: string;
  button: string;
  progress: string;
  panel: string;
  accent: string;
}> = {
  blue: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
    text: "text-blue-800 dark:text-blue-200",
    border: "border-blue-600",
    cardBorder: "border-blue-200 dark:border-blue-900/60",
    button: "bg-blue-700 hover:bg-blue-800",
    progress: "bg-blue-600",
    panel: "bg-blue-50 dark:bg-blue-900/10",
    accent: "accent-blue-600 dark:accent-blue-400",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
    text: "text-emerald-800 dark:text-emerald-200",
    border: "border-emerald-600",
    cardBorder: "border-emerald-200 dark:border-emerald-900/60",
    button: "bg-emerald-700 hover:bg-emerald-800",
    progress: "bg-emerald-600",
    panel: "bg-emerald-50 dark:bg-emerald-900/10",
    accent: "accent-emerald-600 dark:accent-emerald-400",
  },
  gold: {
    badge: "bg-yellow-100 text-yellow-900 dark:bg-yellow-950/60 dark:text-yellow-200",
    text: "text-yellow-900 dark:text-yellow-200",
    border: "border-yellow-600",
    cardBorder: "border-yellow-200 dark:border-yellow-900/60",
    button: "bg-yellow-700 hover:bg-yellow-800",
    progress: "bg-yellow-600",
    panel: "bg-yellow-50 dark:bg-yellow-900/10",
    accent: "accent-yellow-600 dark:accent-yellow-400",
  },
  red: {
    badge: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200",
    text: "text-red-800 dark:text-red-200",
    border: "border-red-600",
    cardBorder: "border-red-200 dark:border-red-900/60",
    button: "bg-red-700 hover:bg-red-800",
    progress: "bg-red-600",
    panel: "bg-red-50 dark:bg-red-900/10",
    accent: "accent-red-600 dark:accent-red-400",
  },
  teal: {
    badge: "bg-teal-100 text-teal-900 dark:bg-teal-950/50 dark:text-teal-200",
    text: "text-teal-900 dark:text-teal-200",
    border: "border-teal-700",
    cardBorder: "border-teal-200 dark:border-teal-900/60",
    button: "bg-teal-700 hover:bg-teal-800",
    progress: "bg-teal-600",
    panel: "bg-teal-50 dark:bg-teal-900/10",
    accent: "accent-teal-600 dark:accent-teal-400",
  },
  copper: {
    badge: "bg-orange-100 text-orange-900 dark:bg-orange-950/50 dark:text-orange-200",
    text: "text-orange-900 dark:text-orange-200",
    border: "border-orange-700",
    cardBorder: "border-orange-200 dark:border-orange-900/60",
    button: "bg-orange-700 hover:bg-orange-800",
    progress: "bg-orange-600",
    panel: "bg-orange-50 dark:bg-orange-900/10",
    accent: "accent-orange-600 dark:accent-orange-400",
  },
  slate: {
    badge: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
    text: "text-slate-700 dark:text-slate-200",
    border: "border-slate-500",
    cardBorder: "border-slate-200 dark:border-slate-700",
    button: "bg-slate-700 hover:bg-slate-800",
    progress: "bg-slate-500",
    panel: "bg-white dark:bg-zinc-800",
    accent: "accent-slate-600 dark:accent-slate-400",
  },
  violet: {
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200",
    text: "text-violet-800 dark:text-violet-200",
    border: "border-violet-600",
    cardBorder: "border-violet-200 dark:border-violet-900/60",
    button: "bg-violet-700 hover:bg-violet-800",
    progress: "bg-violet-600",
    panel: "bg-violet-50 dark:bg-violet-900/10",
    accent: "accent-violet-600 dark:accent-violet-400",
  },
  amber: {
    badge: "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200",
    text: "text-amber-900 dark:text-amber-200",
    border: "border-amber-600",
    cardBorder: "border-amber-200 dark:border-amber-900/60",
    button: "bg-amber-700 hover:bg-amber-800",
    progress: "bg-amber-600",
    panel: "bg-amber-50 dark:bg-amber-900/10",
    accent: "accent-amber-600 dark:accent-amber-400",
  },
};
