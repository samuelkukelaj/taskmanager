import { TaskStore } from './task-store';

describe('TaskStore', () => {
  let store: TaskStore;

  beforeEach(() => {
    store = new TaskStore();
  });

  it('keeps task IDs unique and trims new task content', () => {
    store.add({ title: '  Një detyrë  ', description: '  Një shënim  ' });
    store.add({ title: 'Një tjetër', description: '' });

    expect(new Set(store.tasks().map((task) => task.id)).size).toBe(store.tasks().length);
    expect(store.tasks()[1]).toMatchObject({
      title: 'Një detyrë',
      description: 'Një shënim',
      isCompleted: false,
    });
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
    const completed = store.tasks().find((task) => task.isCompleted)!;
    store.toggle(completed.id);

    expect(store.counts()).toEqual({ all: 4, active: 4, completed: 0 });
    expect(store.progress()).toBe(0);
    store.toggle(completed.id);
    expect(store.progress()).toBe(25);
  });

  it('updates task content without changing its identity or completed state', () => {
    const completed = store.tasks().find((task) => task.isCompleted)!;
    store.update(completed.id, { title: '  Titull i ri  ', description: '  Shënim i ri  ' });

    expect(store.tasks().find((task) => task.id === completed.id)).toEqual({
      ...completed,
      title: 'Titull i ri',
      description: 'Shënim i ri',
    });
  });
});
