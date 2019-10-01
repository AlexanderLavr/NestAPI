import { Controller, Get, Post, Req, Res, Put, Delete, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService, UsersService } from '../services';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly authService: AuthService) { }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(@Res() res: Response): any {
        return this.usersService.findAll(res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/avatar/:id')
    getAvatar(@Req() req: Request, @Res() res: Response) {
        return this.usersService.getAvatar(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/avatar/:id')
    changeAvatar(@Req() req: Request, @Res() res: Response) {
        return this.usersService.changeAvatar(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    findOne(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.findOne(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    delete(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.delete(req, res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    update(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.update(req, res);
    }

    @Post('/register')
    registerNewUser(@Req() req: Request, @Res() res: Response): any {
        return this.usersService.registerNewUser(req, res);
    }

}
