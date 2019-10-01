import { books } from '../entities';

export const booksProviders = [
  {
    provide: 'BOOKS_REPOSITORY',
    useValue: books,
  },
];