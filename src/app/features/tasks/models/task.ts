export interface TaskDraft {
  readonly title: string;
  readonly description: string;
}

export interface Task extends TaskDraft {
  readonly id: number;
  readonly isCompleted: boolean;
}

export interface TaskUpdate {
  readonly id: number;
  readonly draft: TaskDraft;
}
