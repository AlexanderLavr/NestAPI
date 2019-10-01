import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcrypt"
import { users, roles } from '../entities';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from "@nestjs/common"
import { ConfigService } from '../config/config.service';
import * as jwtr from "jwt-then";
import { validLogin } from '../help/login.valid';



@Injectable()
export class AuthService{
  public jwtService: JwtService;
  @Inject('AUTH_REPOSITORY') private readonly AUTH_REPOSITORY: typeof users

  constructor(config: ConfigService) {
    
  }

  async validateUser(email: string, password: string): Promise<any> {

    let loginValid = await validLogin(email, password)
    if(loginValid.stateValid !== 2 ){
      throw new HttpException(loginValid.errorObj, 404);
    }
    
    const user: any = await this.AUTH_REPOSITORY.findOne<users>({ where: { email: email } })
    if (!user) {
      return null
    }

    const matchPasswords = await bcrypt.compare(password, user.dataValues.password);
    if (user && matchPasswords) {
      return user.dataValues;
    }else return null
  }

     
 public async login(user, res){   
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
      isAdmin: permissions[0]
    };
    const token = await jwtr.sign(userLogin, 'secret')
     return res.status(200).send({
      success: true,
      data: token
    });
  }
}