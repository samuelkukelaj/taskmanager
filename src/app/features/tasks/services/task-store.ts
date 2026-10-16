import { Injectable, computed, signal } from '@angular/core';
import { INITIAL_TASKS } from '../data/initial-tasks';
import type { Task, TaskDraft } from '../models/task';
import type { TaskCounts } from '../models/task-filter';
import { normalizeTaskDraft } from '../utils/task-validation';

@Injectable()
export class TaskStore {
  private readonly taskState = signal<readonly Task[]>(INITIAL_TASKS);
  private nextId = Math.max(0, ...INITIAL_TASKS.map((task) => task.id)) + 1;

  readonly tasks = this.taskState.asReadonly();

  readonly counts = computed<TaskCounts>(() => {
    const all = this.tasks().length;
    const completed = this.tasks().filter((task) => task.isCompleted).length;

    return { all, active: all - completed, completed };
  });

  readonly progress = computed(() => {
    const { all, completed } = this.counts();

    return all === 0 ? 0 : Math.round((completed / all) * 100);
  });

  add(draft: TaskDraft): Task | null {
    const normalizedDraft = normalizeTaskDraft(draft);

    if (!normalizedDraft) {
      return null;
    }

    const task: Task = {
      ...normalizedDraft,
      id: this.nextId++,
      isCompleted: false,
    };

    this.taskState.update((tasks) => [task, ...tasks]);

    return task;
  }

  toggle(id: number): void {
    this.taskState.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)),
    );
  }

  update(id: number, draft: TaskDraft): void {
    const normalizedDraft = normalizeTaskDraft(draft);

    if (!normalizedDraft) {
      return;
    }

    this.taskState.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ...normalizedDraft } : task)),
    );
  }
}
