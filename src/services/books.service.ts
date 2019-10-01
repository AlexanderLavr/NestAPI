import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Books } from '../entities';
import { Response } from 'express';
import { getRole } from '../help/actions';

interface BookRes {
  success: boolean
  message?: string
}

@Injectable()
export class BooksService {
  constructor(
    @Inject('BOOKS_REPOSITORY') private readonly BOOKS_REPOSITORY: typeof Books) { }

  async findAll(): Promise<Books[]> {
    return await this.BOOKS_REPOSITORY.findAll<Books>();
  }

  async findOne(req, res): Promise<Books> {
    let book: any = await this.BOOKS_REPOSITORY.findOne<Books>({ where: { _id: req.params.id } });
    if(book){
      return res.status(200).send({
        success: true,
        data: book
      });
    }else{
      return res.status(404).send({
        success: false,
        message: 'Requset body is incorrect!',
      });
    }
  }

  async updateBook(req, res): Promise<BookRes> {
    if(req.params.id) {
      const book = req.body;
      await this.BOOKS_REPOSITORY.update<Books>(book, { where: { _id: req.params.id } })
      return res.status(200).send({
        success: true
      });
    } else return res.status(404).send({
      success: false,
      message: 'Requset body is incorrect!',
    });

  }

  async deleteBook(req, res): Promise<BookRes> {
    let role = await getRole(req.headers.authorization);
    if(role.isAdmin === 'admin'){
      if (req.body) {
      await req.body.forEach(async id => {
          await this.BOOKS_REPOSITORY.destroy({ where: { _id: id } })
      });
        return res.status(200).send({
          success: true
        });
      } else return res.status(404).send({
        success: false,
        message: 'Requset body is incorrect!',
      });
    }
  }

  async addBook(req, res): Promise<BookRes> {
      if (req.body.title){
        const book = req.body;
        await this.BOOKS_REPOSITORY.create<Books>(book)
        return res.status(200).send({
          success: true,
          message: 'Add is done!'
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'Requset body is incorrect!',
        });
      }
  }
}