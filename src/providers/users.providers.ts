import { User, Role , User_Role} from '../entities';

export const usersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: User,
  },
];

export const rolesProviders = [
  {
    provide: 'ROLES_REPOSITORY',
    useValue: Role,
  },
];

export const usersrolesProviders = [
  {
    provide: 'USER_ROLES_REPO',
    useValue: User_Role,
  },
];

