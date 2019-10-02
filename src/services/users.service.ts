import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getRole } from '../help/base.servis';
import { UserResponseModel } from '../models';
import { UsersRepository, UserRolesRepository } from '../repositories';


@Injectable()
export class UsersService {
  constructor(
    public UsersRepository: UsersRepository,
    public UserRolesRepository: UserRolesRepository
  ) { }

  async findAll(): Promise<UserResponseModel> {
    const users: any = await this.UsersRepository.findAll();
      return { success: true, data: users }
  }

  async findOne(req): Promise<UserResponseModel> {
    let role = await getRole(req.headers.authorization);
    if(role.isAdmin === 'admin'){
      const user = await this.UsersRepository.findOne({ attributes: ['id', 'firstname', 'secondname', 'email'], where: { id: req.params.id } });
      return { success: true, data: user }
    }
  }

  async changeAvatar(user): Promise<UserResponseModel> {
    let id = user.params.id
    await this.UsersRepository.update(user.body, id)
    return { success: true, data: user.body.imageProfile }
  }

  async getAvatar(user): Promise<UserResponseModel> {
    const users: any = await this.UsersRepository.findOne({ attributes: ['imageProfile'], where: { id: user.params.id } });
    const avatar = users.dataValues.imageProfile
    return { success: true, data: avatar }
  }

  async delete(user): Promise<UserResponseModel> {
    let role = await getRole(user.headers.authorization);
    if(role.isAdmin === 'admin'){
      await this.UserRolesRepository.destroyUserRoles({ where: { users_id: user.params.id } })
      await this.UsersRepository.destroyUsers({ where: { id: user.params.id } })
      return { success: true }
    }
  }

  async update(user): Promise<UserResponseModel> {
    await this.UsersRepository.update(user.body, user.params.id)
    return { success: true }
  }

  async registerNewUser(user): Promise<UserResponseModel> {
      const registerObj = user.body;
      const errorObj = {
          errorFirstname: '',
          errorSecondname: '',
          errorEmail: '',
          errorPassword: ''
      }
      let stateValid = 0;
  
      const inpRegExpr = new RegExp(/^[a-zA-Z]{3,}$/);
      const passWordExpr = new RegExp(/^[0-9]{3,}$/);
      const emailRegExpr = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
  
      if(!inpRegExpr.test(registerObj.firstname)){
          errorObj.errorFirstname = 'Error: допустимы буквы латинского алфавита менее 3-х';
      }else{++stateValid}
      if(!inpRegExpr.test(registerObj.secondname)){
          errorObj.errorSecondname = 'Error: допустимы буквы латинского алфавита менее 3-х';
      }else{++stateValid}
      if(!emailRegExpr.test(registerObj.email)){
          errorObj.errorEmail = 'Error: uncorrectEmail value!';
      }else{++stateValid}
      if(!passWordExpr.test(registerObj.password)){
          errorObj.errorPassword = 'Error: допустимы цифры не менее 3-х';
      }else{++stateValid}

      if(stateValid === 4){
        const newUser: any = {
          id: null,
          firstname: user.body.firstname,
          secondname: user.body.secondname,
          password: await bcrypt.hash(user.body.password, 10),
          email: user.body.email,
          imageProfile: user.body.imageProfile
        };
        const matchUser: any = await this.UsersRepository.findOne({ where: { email: newUser.email } })
        if (!matchUser) {
          await this.UsersRepository.create(newUser)
  
          const user: any = await this.UsersRepository.findOne({ attributes: ['id'], where: { email: newUser.email } })
          const newId = user.dataValues.id
          const newRole = {
            users_id: newId,
            roles_id: 2
          }
          await this.UserRolesRepository.create(newRole)
           return { success: true, message: 'User Successfully created' }
        } else return { success: false, errorValid: false, message: `User with E-mail:${matchUser.email} alredy exist!` }
    }else{
      return { success: false, errorValid: true, data: errorObj }
    }
  }
}