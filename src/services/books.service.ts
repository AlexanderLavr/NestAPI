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


  async findOne(req, res): Promise<Books> {
    let book: any = await this.BooksRepository.findOne(req.params.id);
    if(book){
      return res.status(200).send({
        success: true,
        data: book
      });
    }else{
      return res.status(204).send({
        success: false,
        message: 'Requset body is incorrect!',
      });
    }
  }

  async updateBook(req, res): Promise<BookResponseModel> {
    let id = req.params.id;
    if(id) { 
      const book = req.body;
      await this.BooksRepository.updateBook(book, id)
      return res.status(200).send({
        success: true
      });
    } else return res.status(204).send({
      success: false,
      message: 'Requset body is incorrect!',
    });

  }

  async deleteBook(req, res): Promise<BookResponseModel> {
    let role = await getRole(req.headers.authorization);
    if(role.isAdmin === 'admin'){
      if (req.body) {
      await req.body.forEach(async id => {
        await this.BooksRepository.deleteBook(id)
      });
        return res.status(200).send({
          success: true
        });
      } else return res.status(204).send({
        success: false,
        message: 'Requset body is incorrect!',
      });
    }
  }

  async addBook(req, res): Promise<BookResponseModel> {
      if (req.body.title){
        const book = req.body;
        await this.BooksRepository.addBook(book)
        return res.status(200).send({
          success: true,
          message: 'Add is done!'
        });
      } else {
        return res.status(204).send({
          success: false,
          message: 'Requset body is incorrect!',
        });
      }
  }
}