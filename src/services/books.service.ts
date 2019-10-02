import { Injectable } from '@nestjs/common';
import { Books } from '../entities';
import { getRole } from '../help/base.servis';
import  { BookResponseModel }  from '../models';
import { BooksRepository } from '../repositories';


@Injectable()
export class BooksService {
  constructor(public BooksRepository: BooksRepository ) { }

  async findAll(): Promise<Books[]> {
    return  await this.BooksRepository.findAll()
  }

  async findOne(req): Promise<BookResponseModel> {
    let book: Books = await this.BooksRepository.findOne(req.params.id);
    return { success: true, data: book }
  }

  async updateBook(updateBook): Promise<BookResponseModel> {
    let id = updateBook.params.id;
    const book = updateBook.body;
    await this.BooksRepository.updateBook(book, id)
    return { success: true }
  }

  async deleteBook(book): Promise<BookResponseModel> {
    let role = await getRole(book.headers.authorization);
    if(role.isAdmin === 'admin'){
      await book.body.forEach(async id => {
        await this.BooksRepository.deleteBook(id)
      });
      return { success: true }
    }
  }

  async addBook(addBook): Promise<BookResponseModel> {
    const book = addBook.body;
    await this.BooksRepository.addBook(book)
    return { success: true };
  }
}