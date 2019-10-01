import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services';





@Controller('login')
export class AuthController {
    constructor(public authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post()
    async login(@Req() req, @Res() res){
        return this.authService.login(req.user, res);
    }
}

