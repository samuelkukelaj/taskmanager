import { FormControl, FormGroup } from '@angular/forms';
import type { ValidatorFn } from '@angular/forms';
import type { TaskDraft } from '../models/task';
import { isTaskDescriptionValid, isTaskTitleValid } from '../utils/task-validation';

export type TaskFormGroup = FormGroup<{
  title: FormControl<string>;
  description: FormControl<string>;
}>;

const taskTitleValidator: ValidatorFn = (control) => {
  const value: unknown = control.value;

  return typeof value === 'string' && isTaskTitleValid(value) ? null : { taskTitle: true };
};

const taskDescriptionValidator: ValidatorFn = (control) => {
  const value: unknown = control.value;

  return typeof value === 'string' && isTaskDescriptionValid(value)
    ? null
    : { taskDescription: true };
};

export function createTaskForm(initial: TaskDraft = { title: '', description: '' }): TaskFormGroup {
  return new FormGroup({
    title: new FormControl(initial.title, {
      nonNullable: true,
      validators: taskTitleValidator,
    }),
    description: new FormControl(initial.description, {
      nonNullable: true,
      validators: taskDescriptionValidator,
    }),
  });
}
