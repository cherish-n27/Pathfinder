export type DeadlineItem = {
  title: string;
  deadlineDate: Date | string;
  status?: string;
};

export function deadlineDateKey(value: Date | string) {
  if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function isDeadlineInRange(value: Date | string | null | undefined, from: Date, to: Date) {
  if (!value) return false;
  const key = deadlineDateKey(value);
  const fromKey = deadlineDateKey(from);
  const toKey = deadlineDateKey(to);
  return Boolean(key && fromKey && toKey && key >= fromKey && key < toKey);
}

export function groupDeadlinesByDate<T extends DeadlineItem>(items: T[]) {
  const grouped = new Map<string, T[]>();
  for (const item of items) {
    const key = deadlineDateKey(item.deadlineDate);
    if (key) grouped.set(key, [...(grouped.get(key) ?? []), item]);
  }
  return grouped;
}

export function deadlineTone(items: DeadlineItem[]) {
  return items.some(item => item.status === "Accepted") ? "green" : "coral";
}
