import { Users } from '../entities';

export const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useValue: Users,
  },
];