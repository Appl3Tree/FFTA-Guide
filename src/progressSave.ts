export type ProgressSaveV1 = {
  format: "ffta-progress-v1";
  slot: 1;
  checked: string[];
};

export type ProgressSaveV2 = {
  format: "ffta-progress-v2";
  slot: 1;
  checked: string[];
  expanded: string[];
};

export type ParsedProgressSave = {
  version: 1 | 2;
  checked: Record<string, boolean>;
  expanded?: Record<string, boolean>;
  panelView?: Record<string, boolean>;
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");

const keysToCheckedMap = (keys: string[]) =>
  Object.fromEntries(keys.map((key) => [key, true] as const));

export function buildProgressSave(
  checked: Record<string, boolean>,
  expanded: Record<string, boolean>,
  panelView: Record<string, boolean>,
): ProgressSaveV2 {
  return {
    format: "ffta-progress-v2",
    slot: 1,
    checked: Object.keys(checked).filter((key) => checked[key]),
    expanded: [
      ...Object.keys(expanded).filter((key) => expanded[key]),
      ...Object.keys(panelView).filter((key) => panelView[key]),
    ],
  };
}

export function parseProgressSave(text: string): ParsedProgressSave {
  const value: unknown = JSON.parse(text);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid save format");
  }
  const save = value as Record<string, unknown>;
  if (save.slot !== 1 || !isStringArray(save.checked)) {
    throw new Error("Invalid save format");
  }

  if (save.format === "ffta-progress-v1") {
    return { version: 1, checked: keysToCheckedMap(save.checked) };
  }

  if (save.format === "ffta-progress-v2" && isStringArray(save.expanded)) {
    const expanded: Record<string, boolean> = {};
    const panelView: Record<string, boolean> = {};
    for (const key of save.expanded) {
      if (key.startsWith("panel:")) panelView[key] = true;
      else expanded[key] = true;
    }
    return {
      version: 2,
      checked: keysToCheckedMap(save.checked),
      expanded,
      panelView,
    };
  }

  throw new Error("Invalid save format");
}
