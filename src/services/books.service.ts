import { Injectable } from '@nestjs/common';
import { Book } from '../entities';
import  { BookResponseModel }  from '../models';
import { BooksRepository } from '../repositories';


@Injectable()
export class BooksService {
  constructor(public booksRepository: BooksRepository ) { }

  async findAll(): Promise<Book[]> {
    return  await this.booksRepository.findAll()
  }
   
  async findOne(id: string): Promise<BookResponseModel> {
    let book: Book = await this.booksRepository.findOne(id);
    return { success: true, data: book }
  }

  async updateBook(id: string, book: Book): Promise<BookResponseModel> {
    await this.booksRepository.updateBook(book, id)
    return { success: true }
  }

  async deleteBook(deleteArr: string[]): Promise<BookResponseModel> {
    await deleteArr.forEach(async id => {
      await this.booksRepository.deleteBook(id)
    });
    return { success: true }
  }

  async addBook(book: Book): Promise<BookResponseModel> {
    await this.booksRepository.addBook(book)
    return { success: true };
  }
}