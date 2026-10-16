import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskDraft } from '../../models/task';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule, Icon],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm {
  readonly taskCreated = output<TaskDraft>();
  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly announcement = signal('');
  private readonly titleInput = viewChild.required<ElementRef<HTMLInputElement>>('titleInput');

  focusTitle(): void {
    this.titleInput().nativeElement.focus();
  }

  protected submit(): void {
    const title = this.title().trim();

    if (!title || title.length > 120 || this.description().length > 240) return;

    this.taskCreated.emit({ title, description: this.description().trim() });
    this.title.set('');
    this.description.set('');
    this.announcement.set(`Detyra “${title}” u shtua.`);
    this.focusTitle();
  }
}
