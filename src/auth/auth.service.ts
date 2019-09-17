import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcrypt"
import { users, roles } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from "@nestjs/common"
import { ConfigService } from '../config/config.service';
import * as jwtr from "jwt-then";
import { validLogin } from '../help//login.valid';



@Injectable()

export class AuthService {
  private test: any;
  public jwtService: JwtService;
  @Inject('AUTH_REPOSITORY') private readonly AUTH_REPOSITORY: typeof users

  constructor(config: ConfigService) {
    this.test = config.get('APP');
  }



  async login(req: any, res:any){
    let {email, password } = req.body;
    let loginValid = await validLogin(req.body)
    if(loginValid.stateValid === 2){//valid input
      const user: any = await this.AUTH_REPOSITORY.findOne<users>({ where: { email: email } })
      if(!user){
        res.status(401).send({
          success: false,
          message: 'User not found!'
        });
      }
      const matchPasswords = await bcrypt.compare(password, user.dataValues.password);
      if(!matchPasswords){
        res.status(401).send({
          success: false,
          message: 'Not authorized!'
        });
      }
    let permissions: any[] = [];

    await this.AUTH_REPOSITORY.findAll<users>({
        where: { id: user.id },
        include: [{
          model: roles,
        }]

      }).then((rolen: any) => rolen.forEach(el => {
        el.roleId.forEach(element => {
          permissions.push(element.dataValues.roleName);
        });
    }))

    const userLogin = {
      id: user.id,
      firstname: user.firstname,
      secondname: user.secondname,
      email: user.email,
      imageProfile: user.imageProfile,
      isAdmin: permissions[0]
    };

    const token = await jwtr.sign(userLogin, 'secret')
    res.status(200).send({
      success: true,
      data: token
    });
    }else{
      res.status(401).send({
        success: false,
        errorValid: true,
        data: loginValid.errorObj
      });
    }
  }
}