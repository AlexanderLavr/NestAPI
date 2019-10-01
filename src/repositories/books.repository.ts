import { Injectable, Inject } from '@nestjs/common';
import { Books } from '../entities';


@Injectable()
export class BooksRepository {
    @Inject('BOOKS_REPOSITORY') public BOOKS_REPOSITORY: typeof Books
   
    async findAll(){
        return  this.BOOKS_REPOSITORY.findAll<Books>();
    }
    async findOne(id: string){
        return this.BOOKS_REPOSITORY.findOne<Books>({ where: { _id: id }})
    }
    async updateBook(book: Books, id: string){
        return this.BOOKS_REPOSITORY.update<Books>(book, { where: { _id: id }})
    }
    async deleteBook(id: string){
        return this.BOOKS_REPOSITORY.destroy({ where: { _id: id } })
    }
    async addBook(book: Books){
        return this.BOOKS_REPOSITORY.create<Books>(book)
    }
}