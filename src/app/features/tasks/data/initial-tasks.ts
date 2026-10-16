import type { Task } from '../models/task';

export const INITIAL_TASKS: readonly Task[] = [
  {
    id: 1,
    title: 'Me mësu Angular',
    description: 'Me kuptu strukturën e një projekti Angular.',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Organizo javën',
    description: 'Zgjidh tri gjërat më të rëndësishme për këtë javë.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Pak kohë për një ide të re',
    description: 'Shëno diçka që do të doje ta krijoje.',
    isCompleted: false,
  },
  {
    id: 4,
    title: 'Hapi i parë: krijo hapësirën tënde',
    description: 'Një fillim i thjeshtë për një ditë më të organizuar.',
    isCompleted: true,
  },
];
