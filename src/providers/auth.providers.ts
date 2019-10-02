import { User } from '../entities';

export const authProviders = [
  {
    provide: 'AUTH_REPOSITORY',
    useValue: User,
  },
];