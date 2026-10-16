import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { TaskStore } from './features/tasks/services/task-store';

describe('Task manager', () => {
  let fixture: ComponentFixture<App>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    fixture = TestBed.createComponent(App);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  async function fill(selector: string, value: string): Promise<void> {
    const input = element.querySelector<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  }

  async function submit(selector: string): Promise<void> {
    element
      .querySelector(selector)!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
  }

  it('renders the task manager and initial task list', () => {
    expect(element.querySelector('h1')?.textContent).toContain('Të gjitha detyrat');
    expect(element.querySelectorAll('.task-item')).toHaveLength(4);
    expect(element.querySelector('progress')?.value).toBe(1);
  });

  it('adds a trimmed task, clears the form, and makes it visible from another filter', async () => {
    element.querySelectorAll<HTMLButtonElement>('.navigation-item')[2].click();
    await fixture.whenStable();
    await fill('#new-task-title', '  Detyra ime  ');
    await fill('#new-task-description', '  Një shënim  ');
    await submit('.task-form');

    expect(element.querySelector('h1')?.textContent).toContain('Të gjitha detyrat');
    expect(element.querySelectorAll('.task-item')).toHaveLength(5);
    expect(element.querySelector('.task-title')?.textContent).toBe('Detyra ime');
    expect(element.querySelector('.task-copy p')?.textContent).toBe('Një shënim');
    expect(element.querySelector<HTMLInputElement>('#new-task-title')?.value).toBe('');
    expect(TestBed.inject(TaskStore).counts().all).toBe(5);
  });

  it('rejects titles containing only spaces', async () => {
    await fill('#new-task-title', '   ');
    await submit('.task-form');

    expect(element.querySelector<HTMLButtonElement>('.add-button')?.disabled).toBe(true);
    expect(element.querySelectorAll('.task-item')).toHaveLength(4);
  });

  it('combines a status filter with search and displays an empty result', async () => {
    element.querySelectorAll<HTMLButtonElement>('.navigation-item')[1].click();
    await fixture.whenStable();
    expect(element.querySelectorAll('.task-item')).toHaveLength(3);

    await fill('input[type="search"]', 'ANGULAR');
    expect(element.querySelectorAll('.task-item')).toHaveLength(1);

    await fill('input[type="search"]', 'nuk ekziston');
    expect(element.querySelectorAll('.task-item')).toHaveLength(0);
    expect(element.querySelector('.empty-state')?.textContent).toContain('Nuk u gjet asnjë detyrë');
  });

  it('updates progress and removes a completed task from the active filter', async () => {
    element.querySelectorAll<HTMLButtonElement>('.navigation-item')[1].click();
    await fixture.whenStable();
    element.querySelector<HTMLInputElement>('.task-checkbox')!.click();
    await fixture.whenStable();

    expect(element.querySelectorAll('.task-item')).toHaveLength(2);
    expect(element.querySelector('progress')?.value).toBe(2);
    expect(element.querySelector('.progress-value')?.textContent).toContain('50');
  });

  it('saves task edits and discards cancelled edits', async () => {
    element.querySelector<HTMLButtonElement>('.edit-button')!.click();
    await fixture.whenStable();
    await fill('#edit-title-1', 'Titulli i përditësuar');
    await submit('.edit-form');
    expect(element.querySelector('.task-title')?.textContent).toBe('Titulli i përditësuar');

    element.querySelector<HTMLButtonElement>('.edit-button')!.click();
    await fixture.whenStable();
    await fill('#edit-title-1', 'Ndryshim i paruajtur');
    element.querySelector<HTMLButtonElement>('.secondary-button')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.task-title')?.textContent).toBe('Titulli i përditësuar');
  });
});
