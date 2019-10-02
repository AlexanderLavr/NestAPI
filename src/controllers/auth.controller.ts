import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services';





@Controller('login')
export class AuthController {
    constructor(public authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post()
    async login(@Req() req){
        return this.authService.login(req.user);
    }
}

