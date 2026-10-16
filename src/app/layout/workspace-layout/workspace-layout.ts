import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-workspace-layout',
  templateUrl: './workspace-layout.html',
  styleUrl: './workspace-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceLayout {}
