import type { TaskDraft } from '../models/task';

export const TASK_LIMITS = {
  title: 120,
  description: 240,
} as const;

export function normalizeTaskDraft(draft: TaskDraft): TaskDraft | null {
  if (!isTaskTitleValid(draft.title) || !isTaskDescriptionValid(draft.description)) {
    return null;
  }

  return { title: draft.title.trim(), description: draft.description.trim() };
}

export function isTaskTitleValid(value: string): boolean {
  const title = value.trim();

  return title.length > 0 && title.length <= TASK_LIMITS.title;
}

export function isTaskDescriptionValid(value: string): boolean {
  return value.length <= TASK_LIMITS.description;
}
