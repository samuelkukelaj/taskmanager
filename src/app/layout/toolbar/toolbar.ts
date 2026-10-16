import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Icon } from '../../shared/ui/icon/icon';

@Component({
  selector: 'app-toolbar',
  imports: [Icon],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  readonly search = input.required<string>();
  readonly searchChanged = output<string>();
}
