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
import { FormsModule } from '@angular/forms';
import { Task, TaskUpdate } from '../../models/task';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-task-item',
  imports: [FormsModule, Icon],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItem {
  readonly task = input.required<Task>();
  readonly taskToggled = output<number>();
  readonly taskUpdated = output<TaskUpdate>();
  protected readonly editing = signal(false);
  protected readonly draftTitle = signal('');
  protected readonly draftDescription = signal('');
  private readonly editTitle = viewChild<ElementRef<HTMLInputElement>>('editTitle');
  private readonly editButton = viewChild<ElementRef<HTMLButtonElement>>('editButton');
  private readonly injector = inject(Injector);

  protected startEditing(): void {
    this.draftTitle.set(this.task().title);
    this.draftDescription.set(this.task().description);
    this.editing.set(true);
    afterNextRender(() => this.editTitle()?.nativeElement.focus(), { injector: this.injector });
  }

  protected save(): void {
    const title = this.draftTitle().trim();

    if (!title || title.length > 120 || this.draftDescription().length > 240) return;

    this.taskUpdated.emit({
      id: this.task().id,
      draft: { title, description: this.draftDescription().trim() },
    });
    this.closeEditor();
  }

  protected closeEditor(): void {
    this.editing.set(false);
    afterNextRender(() => this.editButton()?.nativeElement.focus(), { injector: this.injector });
  }
}
