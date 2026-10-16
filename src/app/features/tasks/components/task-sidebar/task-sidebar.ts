import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TASK_VIEWS } from '../../config/task-views';
import type { TaskCounts, TaskFilter } from '../../models/task-filter';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-task-sidebar',
  imports: [Icon],
  templateUrl: './task-sidebar.html',
  styleUrl: './task-sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSidebar {
  readonly selectedFilter = input.required<TaskFilter>();
  readonly counts = input.required<TaskCounts>();
  readonly filterChanged = output<TaskFilter>();
  protected readonly filters = Object.values(TASK_VIEWS);
}
