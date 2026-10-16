import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { WorkspaceLayout } from '../../../../layout/workspace-layout/workspace-layout';
import { TaskSidebar } from '../../components/task-sidebar/task-sidebar';
import { TaskToolbar } from '../../components/task-toolbar/task-toolbar';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskList } from '../../components/task-list/task-list';
import { TaskProgress } from '../../components/task-progress/task-progress';
import { TASK_VIEWS } from '../../config/task-views';
import type { TaskDraft } from '../../models/task';
import type { TaskFilter } from '../../models/task-filter';
import { TaskStore } from '../../services/task-store';

@Component({
  selector: 'app-tasks-page',
  imports: [WorkspaceLayout, TaskSidebar, TaskToolbar, TaskForm, TaskList, TaskProgress],
  providers: [TaskStore],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPage {
  protected readonly store = inject(TaskStore);

  protected readonly selectedFilter = signal<TaskFilter>('all');
  protected readonly search = signal('');

  protected readonly currentView = computed(() => TASK_VIEWS[this.selectedFilter()]);
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
    if (!this.store.add(draft)) {
      return;
    }

    this.selectedFilter.set('all');
    this.search.set('');
  }
}
