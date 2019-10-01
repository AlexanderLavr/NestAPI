import { users } from '../entities';

export const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useValue: users,
  },
];