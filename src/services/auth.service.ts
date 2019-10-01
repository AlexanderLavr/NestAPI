import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from "@nestjs/common"
import * as jwtr from 'jwt-then';
import { AuthRepository } from '../repositories';



@Injectable()
export class AuthService{
  public jwtService: JwtService;

  constructor(public AuthRepository : AuthRepository) {}

  async validateUser(email: string, password: string): Promise<any> {

    const errorObj = {
      logErrorEmail: '',
      logErrorPassword: ''
    }
    let stateValid = 0;
    const passWordExpr = new RegExp(/^[0-9]{3,}$/);
    const emailRegExpr = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);

    if(!emailRegExpr.test(email)){
        errorObj.logErrorEmail = 'Error: uncorrectEmail value!';
    }else{++stateValid}
    if(!passWordExpr.test(password)){
        errorObj.logErrorPassword = 'Error: допустимы буквы латинского алфавита и цифры не менее 3-х';
    }else{++stateValid}

    if(stateValid !== 2 ){
      throw new HttpException(errorObj, 404);
    }
  
    const user: any = await this.AuthRepository.findOneEmail(email)
    if (!user) {
      return null
    }

    const matchPasswords = await this.AuthRepository.comparePassword(password, user.dataValues.password)
    if (user && matchPasswords) {
      return user.dataValues;
    }else return null
  }

     
 public async login(user, res){   
    let permissions: any = [];
    permissions = await this.AuthRepository.findAllRore(user.id, permissions)
 
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