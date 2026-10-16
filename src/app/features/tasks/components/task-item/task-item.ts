import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { Task, TaskDraft, TaskUpdate } from '../../models/task';
import { TaskEditor } from '../task-editor/task-editor';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-task-item',
  imports: [TaskEditor, Icon],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItem {
  readonly task = input.required<Task>();
  readonly taskToggled = output<number>();
  readonly taskUpdated = output<TaskUpdate>();

  protected readonly editing = signal(false);

  private readonly editButton = viewChild<ElementRef<HTMLButtonElement>>('editButton');
  private readonly injector = inject(Injector);

  protected saveTask(draft: TaskDraft): void {
    this.taskUpdated.emit({ id: this.task().id, draft });
    this.closeEditor();
  }

  protected closeEditor(): void {
    this.editing.set(false);
    afterNextRender(() => this.editButton()?.nativeElement.focus(), { injector: this.injector });
  }
}
