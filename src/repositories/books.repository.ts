import { Injectable, Inject } from '@nestjs/common';
import { Book } from '../entities';


@Injectable()
export class BooksRepository {
    @Inject('BOOKS_REPOSITORY') public BOOKS_REPOSITORY: typeof Book
   
    async findAll(){
        return  this.BOOKS_REPOSITORY.findAll<Book>();
    }
    async findOne(id: string){
        return this.BOOKS_REPOSITORY.findOne<Book>({ where: { _id: id }})
    }
    async updateBook(book: Book, id: string){
        return this.BOOKS_REPOSITORY.update<Book>(book, { where: { _id: id }})
    }
    async deleteBook(id: string){
        return this.BOOKS_REPOSITORY.destroy({ where: { _id: id } })
    }
    async addBook(book: Book){
        return this.BOOKS_REPOSITORY.create<Book>(book)
    }
}