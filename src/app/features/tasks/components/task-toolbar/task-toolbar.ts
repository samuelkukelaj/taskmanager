import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-task-toolbar',
  imports: [Icon],
  templateUrl: './task-toolbar.html',
  styleUrl: './task-toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskToolbar {
  readonly search = input.required<string>();
  readonly searchChanged = output<string>();
}
