import { Controller, Get, Post, Req, Put, Delete, UseGuards, Res } from '@nestjs/common';
import { BooksService } from '../services';
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(): any {
        return this.booksService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/takeEditBook/:id')
    findOne(@Req() book: Request): any {
        return this.booksService.findOne(book);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    updateBook(@Req() book: Request): any {
        return this.booksService.updateBook(book);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/deleteBooks')
    deleteBook(@Req() book: Request): any {
        return this.booksService.deleteBook(book);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    addBook(@Req() book: Request): any {
        return this.booksService.addBook(book);
    }
}
