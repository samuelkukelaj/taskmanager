import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TasksPage } from './tasks-page';
import { TaskStore } from '../../services/task-store';

describe('Task manager', () => {
  let fixture: ComponentFixture<TasksPage>;
  let element: HTMLElement;
  let store: TaskStore;

  const createFormSelector = 'form[aria-label="Shto një detyrë"]';

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TasksPage] }).compileComponents();
    fixture = TestBed.createComponent(TasksPage);
    element = fixture.nativeElement;
    store = fixture.debugElement.injector.get(TaskStore);
    await fixture.whenStable();
  });

  function queryRequired<T extends Element = HTMLElement>(
    selector: string,
    root: ParentNode = element,
  ): T {
    const match = root.querySelector<T>(selector);

    if (!match) {
      throw new Error(`Expected an element matching: ${selector}`);
    }

    return match;
  }

  async function fill(selector: string, value: string): Promise<void> {
    const input = queryRequired<HTMLInputElement>(selector);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  }

  async function submit(selector: string): Promise<void> {
    queryRequired<HTMLFormElement>(selector).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
  }

  async function click(selector: string): Promise<void> {
    queryRequired<HTMLElement>(selector).click();
    await fixture.whenStable();
  }

  it('renders the task manager and initial task list', () => {
    expect(queryRequired('h1').textContent).toContain('Të gjitha detyrat');
    expect(element.querySelectorAll('app-task-item')).toHaveLength(4);
    expect(queryRequired<HTMLProgressElement>('progress').value).toBe(1);
  });

  it('adds a trimmed task, clears the form, and makes it visible from another filter', async () => {
    await click('button[aria-label="Të përfunduara"]');
    await fill('#new-task-title', '  Detyra ime  ');
    await fill('#new-task-description', '  Një shënim  ');
    await submit(createFormSelector);

    const created = store.tasks().find((task) => task.title === 'Detyra ime');

    if (!created) {
      throw new Error('The submitted task was not created.');
    }

    expect(queryRequired('h1').textContent).toContain('Të gjitha detyrat');
    expect(element.querySelectorAll('app-task-item')).toHaveLength(5);
    expect(queryRequired(`label[for="task-${created.id}"]`).textContent).toBe('Detyra ime');
    expect(created.description).toBe('Një shënim');
    expect(queryRequired<HTMLInputElement>('#new-task-title').value).toBe('');
    expect(queryRequired<HTMLInputElement>('#new-task-description').value).toBe('');
    expect(store.counts().all).toBe(5);
  });

  it('rejects titles containing only spaces even if submit is dispatched directly', async () => {
    await fill('#new-task-title', '   ');
    await submit(createFormSelector);

    expect(queryRequired<HTMLButtonElement>('button[aria-label="Shto detyrën"]').disabled).toBe(
      true,
    );
    expect(element.querySelectorAll('app-task-item')).toHaveLength(4);
  });

  it('combines a status filter with search and displays an empty result', async () => {
    await click('button[aria-label="Në pritje"]');
    expect(element.querySelectorAll('app-task-item')).toHaveLength(3);

    await fill('input[type="search"]', 'ANGULAR');
    expect(element.querySelectorAll('app-task-item')).toHaveLength(1);
    expect(queryRequired('label[for="task-1"]').textContent).toBe('Me mësu Angular');

    await fill('input[type="search"]', 'nuk ekziston');
    expect(element.querySelectorAll('app-task-item')).toHaveLength(0);
    expect(queryRequired('[role="status"]', queryRequired('app-task-list')).textContent).toContain(
      'Nuk u gjet asnjë detyrë',
    );
  });

  it('updates progress and removes the completed task from the active filter', async () => {
    await click('button[aria-label="Në pritje"]');
    await click('#task-1');

    expect(element.querySelectorAll('app-task-item')).toHaveLength(2);
    expect(element.querySelector('#task-1')).toBeNull();
    expect(queryRequired<HTMLProgressElement>('progress').value).toBe(2);
    expect(store.progress()).toBe(50);
  });

  it('saves task edits and discards cancelled edits', async () => {
    await click('button[aria-label="Ndrysho detyrën: Me mësu Angular"]');
    await fill('#edit-title-1', 'Titulli i përditësuar');
    await submit('form[aria-label="Ndrysho detyrën: Me mësu Angular"]');
    expect(queryRequired('label[for="task-1"]').textContent).toBe('Titulli i përditësuar');

    await click('button[aria-label="Ndrysho detyrën: Titulli i përditësuar"]');
    await fill('#edit-title-1', 'Ndryshim i paruajtur');
    await click('app-task-editor button[type="button"]');
    expect(queryRequired('label[for="task-1"]').textContent).toBe('Titulli i përditësuar');
  });

  it('keeps the original task when an invalid edit is submitted and then cancelled with Escape', async () => {
    const initial = store.tasks();
    await click('button[aria-label="Ndrysho detyrën: Me mësu Angular"]');
    await fill('#edit-title-1', '   ');
    await submit('form[aria-label="Ndrysho detyrën: Me mësu Angular"]');

    expect(queryRequired<HTMLButtonElement>('app-task-editor button[type="submit"]').disabled).toBe(
      true,
    );
    expect(store.tasks()).toBe(initial);

    queryRequired<HTMLInputElement>('#edit-title-1').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await fixture.whenStable();
    expect(element.querySelector('app-task-editor')).toBeNull();
    expect(queryRequired('label[for="task-1"]').textContent).toBe('Me mësu Angular');
  });

  it('reacts to programmatic form changes and resets values and submission state after adding', async () => {
    const formElement = fixture.debugElement.query(By.directive(FormGroupDirective));

    if (!formElement) {
      throw new Error('The task creation form was not rendered.');
    }

    const directive = formElement.injector.get(FormGroupDirective);
    directive.form.setValue({ title: 'Detyrë programatike', description: '' });
    await fixture.whenStable();
    expect(queryRequired<HTMLButtonElement>('button[aria-label="Shto detyrën"]').disabled).toBe(
      false,
    );

    await submit(createFormSelector);
    expect(directive.form.getRawValue()).toEqual({ title: '', description: '' });
    expect(directive.form.pristine).toBe(true);
    expect(directive.form.untouched).toBe(true);
    expect(directive.submitted).toBe(false);
    expect(queryRequired<HTMLButtonElement>('button[aria-label="Shto detyrën"]').disabled).toBe(
      true,
    );
  });
});
