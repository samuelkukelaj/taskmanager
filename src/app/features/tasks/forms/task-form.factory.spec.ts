import { createTaskForm } from './task-form.factory';
import { TASK_LIMITS, normalizeTaskDraft } from '../utils/task-validation';

describe('Task form validation', () => {
  it.each([
    { title: '', description: '', valid: false },
    { title: '   ', description: '', valid: false },
    { title: 'Detyrë', description: '', valid: true },
    { title: '  Detyrë  ', description: '  Shënim  ', valid: true },
    {
      title: 'a'.repeat(TASK_LIMITS.title),
      description: 'a'.repeat(TASK_LIMITS.description),
      valid: true,
    },
    { title: 'a'.repeat(TASK_LIMITS.title + 1), description: '', valid: false },
    { title: 'Detyrë', description: 'a'.repeat(TASK_LIMITS.description + 1), valid: false },
  ])(
    'uses the same rules as the store for $title / valid=$valid',
    ({ title, description, valid }) => {
      const draft = { title, description };
      const form = createTaskForm();
      form.setValue(draft);

      expect(form.valid).toBe(valid);
      expect(normalizeTaskDraft(form.getRawValue()) !== null).toBe(valid);
    },
  );

  it('resets edited fields to non-nullable initial values', () => {
    const initial = { title: 'Detyra fillestare', description: 'Shënimi fillestar' };
    const form = createTaskForm(initial);
    form.setValue({ title: 'Ndryshim', description: '' });
    form.markAllAsTouched();
    form.markAsDirty();
    form.reset();

    expect(form.getRawValue()).toEqual(initial);
    expect(form.pristine).toBe(true);
    expect(form.untouched).toBe(true);
  });

  it('keeps separate form instances isolated', () => {
    const createForm = createTaskForm();
    const editForm = createTaskForm({ title: 'Detyra ekzistuese', description: '' });
    createForm.controls.title.setValue('Detyra e re');

    expect(editForm.controls.title.value).toBe('Detyra ekzistuese');
  });
});
