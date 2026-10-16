import { TaskStore } from './task-store';
import type { Task } from '../models/task';

describe('TaskStore', () => {
  let store: TaskStore;

  beforeEach(() => {
    store = new TaskStore();
  });

  function getCompletedTask(): Task {
    const completed = store.tasks().find((task) => task.isCompleted);

    if (!completed) {
      throw new Error('Expected an initial completed task.');
    }

    return completed;
  }

  it('keeps task IDs unique and trims new task content', () => {
    const created = store.add({ title: '  Një detyrë  ', description: '  Një shënim  ' });
    store.add({ title: 'Një tjetër', description: '' });

    expect(new Set(store.tasks().map((task) => task.id)).size).toBe(store.tasks().length);
    expect(created).toMatchObject({
      title: 'Një detyrë',
      description: 'Një shënim',
      isCompleted: false,
    });
    expect(store.tasks()).toContainEqual(created);
  });

  it('rejects blank and overlong content without changing existing tasks', () => {
    const initial = store.tasks();
    store.add({ title: '   ', description: '' });
    store.add({ title: 'a'.repeat(121), description: '' });
    store.add({ title: 'Title', description: 'a'.repeat(241) });
    store.update(1, { title: '   ', description: '' });
    store.update(1, { title: 'a'.repeat(121), description: '' });
    store.update(1, { title: 'Title', description: 'a'.repeat(241) });

    expect(store.tasks()).toBe(initial);
  });

  it('reopens completed tasks and keeps counts consistent', () => {
    const completed = getCompletedTask();
    store.toggle(completed.id);

    expect(store.counts()).toEqual({ all: 4, active: 4, completed: 0 });
    expect(store.progress()).toBe(0);
    store.toggle(completed.id);
    expect(store.progress()).toBe(25);
  });

  it('updates task content without changing its identity or completed state', () => {
    const completed = getCompletedTask();
    store.update(completed.id, { title: '  Titull i ri  ', description: '  Shënim i ri  ' });

    expect(store.tasks().find((task) => task.id === completed.id)).toEqual({
      ...completed,
      title: 'Titull i ri',
      description: 'Shënim i ri',
    });
  });
});
