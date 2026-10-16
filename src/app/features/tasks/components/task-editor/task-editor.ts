import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  afterNextRender,
  input,
  output,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { createTaskForm } from '../../forms/task-form.factory';
import type { Task, TaskDraft } from '../../models/task';
import { TASK_LIMITS, normalizeTaskDraft } from '../../utils/task-validation';

@Component({
  selector: 'app-task-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './task-editor.html',
  styleUrl: './task-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEditor implements OnInit {
  readonly task = input.required<Task>();
  readonly saved = output<TaskDraft>();
  readonly cancelled = output<void>();

  protected readonly limits = TASK_LIMITS;
  protected readonly form = createTaskForm();
  protected readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  private readonly titleInput = viewChild.required<ElementRef<HTMLInputElement>>('titleInput');

  constructor() {
    afterNextRender(() => this.titleInput().nativeElement.focus());
  }

  ngOnInit(): void {
    const { title, description } = this.task();
    this.form.reset({ title, description });
  }

  protected save(): void {
    if (!this.form.valid) {
      return;
    }

    const draft = normalizeTaskDraft(this.form.getRawValue());

    if (draft) {
      this.saved.emit(draft);
    }
  }
}
