import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const ICON_PATHS = {
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  circle: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  'check-circle': 'M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  search: 'm21 21-5-5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
  plus: 'M12 5v14M5 12h14',
  edit: 'm15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z',
  arrow: 'm10 7 5 5-5 5',
} as const;

export type IconName = keyof typeof ICON_PATHS;

@Component({
  selector: 'app-icon',
  template: `<svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path [attr.d]="paths[name()]" />
  </svg>`,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly paths = ICON_PATHS;
}
