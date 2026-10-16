import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { TaskCounts } from '../../models/task-filter';

@Component({
  selector: 'app-task-progress',
  templateUrl: './task-progress.html',
  styleUrl: './task-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskProgress {
  readonly counts = input.required<TaskCounts>();
  readonly percentage = input.required<number>();
}
