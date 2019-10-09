import { Controller, Get, Post, Req, Put, Delete, UseGuards } from '@nestjs/common';
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService, UsersService } from '../services';
import { RolesGuard } from '../common/role.guard';
import { Roles } from '../common/role.decorator';



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
    getAvatar(@Req() req: Request) {
        return this.usersService.getAvatar(req.params.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/avatar/:id')
    changeAvatar(@Req() req: Request) {
        return this.usersService.changeAvatar(req.params.id, req.body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:id')
    findOne(@Req() req: Request): any {
        return this.usersService.findOne(req.params.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(RolesGuard)
    @Roles('admin')
    @Delete('/:id')
    delete(@Req() req: Request): any {
        return this.usersService.delete(req.params.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    update(@Req() req: Request): any {
        return this.usersService.update(req.body, req.params.id);
    }

    @Post('/register')
    registerNewUser(@Req() req: Request): any {
        return this.usersService.registerNewUser(req.body);
    }
}
