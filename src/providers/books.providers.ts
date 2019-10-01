import { Books } from '../entities';

export const booksProviders = [
  {
    provide: 'BOOKS_REPOSITORY',
    useValue: Books,
  },
];