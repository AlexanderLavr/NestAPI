import { Controller, Get, Post, Req, Put, Delete, UseGuards, Res, SetMetadata } from '@nestjs/common';
import { BooksService } from '../services';
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/role.guard';
import { Roles } from '../common/role.decorator';


   

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
    findOne(@Req() req: Request): any {
        return this.booksService.findOne(req.params.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    updateBook(@Req() req: Request): any {
        return this.booksService.updateBook(req);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(RolesGuard)
    @Roles('admin')
    @Delete('/deleteBooks')
    deleteBook(@Req() req: Request): any {
        return this.booksService.deleteBook(req.body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    addBook(@Req() req: Request): any {
        return this.booksService.addBook(req.body);
    }
}
