export interface TaskDraft {
  readonly title: string;
  readonly description: string;
}

export interface Task extends TaskDraft {
  readonly id: number;
  readonly isCompleted: boolean;
}

export type TaskFilter = 'all' | 'active' | 'completed';
export type TaskCounts = Readonly<Record<TaskFilter, number>>;

export interface TaskUpdate {
  readonly id: number;
  readonly draft: TaskDraft;
}

export const TASK_FILTERS = [
  {
    id: 'all',
    label: 'Të gjitha',
    title: 'Të gjitha detyrat',
    description: 'Gjithçka që ke në mendje, në një vend.',
    icon: 'list',
  },
  {
    id: 'active',
    label: 'Në pritje',
    title: 'Një hap më afër',
    description: 'Pak përqendrim për gjërat që të presin.',
    icon: 'circle',
  },
  {
    id: 'completed',
    label: 'Të përfunduara',
    title: 'Punë e bukur.',
    description: 'Një moment për të parë sa ke arritur.',
    icon: 'check-circle',
  },
] as const;
