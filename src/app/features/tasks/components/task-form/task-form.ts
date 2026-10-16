import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { createTaskForm } from '../../forms/task-form.factory';
import type { TaskDraft } from '../../models/task';
import { TASK_LIMITS, normalizeTaskDraft } from '../../utils/task-validation';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm {
  readonly taskCreated = output<TaskDraft>();

  protected readonly limits = TASK_LIMITS;
  protected readonly form = createTaskForm();
  protected readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });
  protected readonly announcement = signal('');

  private readonly titleInput = viewChild.required<ElementRef<HTMLInputElement>>('titleInput');
  private readonly formDirective = viewChild.required(FormGroupDirective);

  focusTitle(): void {
    this.titleInput().nativeElement.focus();
  }

  protected submit(): void {
    if (!this.form.valid) {
      return;
    }

    const draft = normalizeTaskDraft(this.form.getRawValue());

    if (!draft) {
      return;
    }

    this.taskCreated.emit(draft);
    this.formDirective().resetForm();
    this.announcement.set(`Detyra “${draft.title}” u shtua.`);
    this.focusTitle();
  }
}
