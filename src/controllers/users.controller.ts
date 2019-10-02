import { Controller, Get, Post, Req, Put, Delete, UseGuards } from '@nestjs/common';
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService, UsersService } from '../services';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly authService: AuthService) { }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll(): any {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/avatar/:id')
    getAvatar(@Req() avatar: Request) {
        return this.usersService.getAvatar(avatar);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/avatar/:id')
    changeAvatar(@Req() avatar: Request) {
        return this.usersService.changeAvatar(avatar);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    findOne(@Req() user: Request): any {
        return this.usersService.findOne(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    delete(@Req() user: Request): any {
        return this.usersService.delete(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    update(@Req() user: Request): any {
        return this.usersService.update(user);
    }

    @Post('/register')
    registerNewUser(@Req() user: Request): any {
        return this.usersService.registerNewUser(user);
    }
}
