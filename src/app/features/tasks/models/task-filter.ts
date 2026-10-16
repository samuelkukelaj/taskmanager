export type TaskFilter = 'all' | 'active' | 'completed';

export type TaskCounts = Readonly<Record<TaskFilter, number>>;
