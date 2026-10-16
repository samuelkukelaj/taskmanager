import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Sidebar } from './layout/sidebar/sidebar';
import { Toolbar } from './layout/toolbar/toolbar';
import { TaskForm } from './features/tasks/components/task-form/task-form';
import { TaskList } from './features/tasks/components/task-list/task-list';
import { TASK_FILTERS, TaskDraft, TaskFilter } from './features/tasks/models/task';
import { TaskStore } from './features/tasks/services/task-store';

@Component({
  selector: 'app-root',
  imports: [Sidebar, Toolbar, TaskForm, TaskList],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly store = inject(TaskStore);
  protected readonly selectedFilter = signal<TaskFilter>('all');
  protected readonly search = signal('');
  protected readonly currentView = computed(() =>
    TASK_FILTERS.find((filter) => filter.id === this.selectedFilter())!,
  );
  protected readonly visibleTasks = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('sq');

    return this.store.tasks().filter((task) => {
      const matchesFilter =
        this.selectedFilter() === 'all' ||
        (this.selectedFilter() === 'completed' ? task.isCompleted : !task.isCompleted);
      const matchesSearch = `${task.title} ${task.description}`
        .toLocaleLowerCase('sq')
        .includes(query);

      return matchesFilter && matchesSearch;
    });
  });

  protected addTask(draft: TaskDraft): void {
    this.store.add(draft);
    this.selectedFilter.set('all');
    this.search.set('');
  }
}
