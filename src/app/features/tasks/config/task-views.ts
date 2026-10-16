import type { IconName } from '../../../shared/ui/icon/icon';
import type { TaskFilter } from '../models/task-filter';

interface TaskView {
  readonly id: TaskFilter;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

export const TASK_VIEWS = {
  all: {
    id: 'all',
    label: 'Të gjitha',
    title: 'Të gjitha detyrat',
    description: 'Gjithçka që ke në mendje, në një vend.',
    icon: 'list',
  },
  active: {
    id: 'active',
    label: 'Në pritje',
    title: 'Një hap më afër',
    description: 'Pak përqendrim për gjërat që të presin.',
    icon: 'circle',
  },
  completed: {
    id: 'completed',
    label: 'Të përfunduara',
    title: 'Punë e bukur.',
    description: 'Një moment për të parë sa ke arritur.',
    icon: 'check-circle',
  },
} as const satisfies Readonly<Record<TaskFilter, TaskView>>;
