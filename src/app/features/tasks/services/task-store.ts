import { Injectable, computed, signal } from '@angular/core';
import { Task, TaskCounts, TaskDraft } from '../models/task';

const INITIAL_TASKS: readonly Task[] = [
  {
    id: 1,
    title: 'Me mësu Angular',
    description: 'Me kuptu strukturën e një projekti Angular.',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Organizo javën',
    description: 'Zgjidh tri gjërat më të rëndësishme për këtë javë.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Pak kohë për një ide të re',
    description: 'Shëno diçka që do të doje ta krijoje.',
    isCompleted: false,
  },
  {
    id: 4,
    title: 'Hapi i parë: krijo hapësirën tënde',
    description: 'Një fillim i thjeshtë për një ditë më të organizuar.',
    isCompleted: true,
  },
];

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly taskState = signal<readonly Task[]>(INITIAL_TASKS);
  private nextId = INITIAL_TASKS.length + 1;

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

  add(draft: TaskDraft): void {
    const title = draft.title.trim();

    if (!title || title.length > 120 || draft.description.length > 240) return;

    const task: Task = {
      id: this.nextId++,
      title,
      description: draft.description.trim(),
      isCompleted: false,
    };

    this.taskState.update((tasks) => [task, ...tasks]);
  }

  toggle(id: number): void {
    this.taskState.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task)),
    );
  }

  update(id: number, draft: TaskDraft): void {
    const title = draft.title.trim();

    if (!title || title.length > 120 || draft.description.length > 240) return;

    this.taskState.update((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, title, description: draft.description.trim() } : task,
      ),
    );
  }
}
