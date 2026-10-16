import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TASK_FILTERS, TaskCounts, TaskFilter } from '../../features/tasks/models/task';
import { Icon } from '../../shared/ui/icon/icon';

@Component({
  selector: 'app-sidebar',
  imports: [Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly selectedFilter = input.required<TaskFilter>();
  readonly counts = input.required<TaskCounts>();
  readonly filterChanged = output<TaskFilter>();
  protected readonly filters = TASK_FILTERS;
}
