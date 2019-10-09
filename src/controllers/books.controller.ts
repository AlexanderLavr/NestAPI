import { Controller, Get, Post, Req, Put, Delete, UseGuards, Res, SetMetadata, Body } from '@nestjs/common';
import { BooksService } from '../services';
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/role.guard';
import { Roles } from '../common/role.decorator';
import { Book } from 'src/entities';
import { BookResponseModel, BookRequestModel, DeleteBookModel } from '../models';


   

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll():  Promise<Book[]> {
        return this.booksService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/takeEditBook/:id')
    findOne(@Req() req: BookRequestModel): Promise<BookResponseModel> {
        return this.booksService.findOne(req.params.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    updateBook(@Req() req: BookRequestModel): Promise<BookResponseModel> {
        return this.booksService.updateBook(req.params.id, req.body);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(RolesGuard)
    @Roles('admin')
    @Delete('/deleteBooks')
    deleteBook(@Req() req: DeleteBookModel): Promise<BookResponseModel> {
        return this.booksService.deleteBook(req.body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    addBook(@Req() req: BookRequestModel): Promise<BookResponseModel>{
        return this.booksService.addBook(req.body);
    }
}
