import { Injectable } from '@nestjs/common';
import { HttpException } from "@nestjs/common"
import * as jwtr from 'jwt-then';
import { AuthRepository } from '../repositories';
import { jwtConstants } from '../secrets/jwtSecretKey';
import { User } from '../entities';


@Injectable()
export class AuthService{

  constructor(public authRepository : AuthRepository) {}

  async validateUser(email: string, password: string): Promise<User> {
   
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
  
    let user: User|any = await this.authRepository.findOneEmail(email)
  
    if (!user) {
      return null
    }
   
    const matchPasswords = await this.authRepository.comparePassword(password, user.dataValues.password)
    
    
    if (user && matchPasswords) {
      return user.dataValues;
    }else return null
  }

     
 public async login(user){ 
    let permissions: string[] = [];
    permissions = await this.authRepository.findAllRore(user.id, permissions)
    const userLogin = {
      id: user.id,
      firstname: user.firstname,
      secondname: user.secondname,
      email: user.email,
      isAdmin: permissions[0]
    };
    const token = await jwtr.sign(userLogin, jwtConstants.secret)
    return { success: true, data: token }
  }
}