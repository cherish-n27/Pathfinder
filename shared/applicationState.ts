export function rollbackApplicationStatus<T extends { status: string }>(items: T[], target: T, previousStatus: string) {
  return items.map(item => item === target ? { ...item, status: previousStatus } : item);
}
