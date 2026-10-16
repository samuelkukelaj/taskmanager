import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task, TaskFilter, TaskUpdate } from '../../models/task';
import { TaskItem } from '../task-item/task-item';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, Icon],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskList {
  readonly tasks = input.required<readonly Task[]>();
  readonly filter = input.required<TaskFilter>();
  readonly hasSearch = input(false);
  readonly taskToggled = output<number>();
  readonly taskUpdated = output<TaskUpdate>();
}
