import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getRole } from '../help/base.servis';
import { UserResponseModel } from '../models';
import { UsersRepository, UserRolesRepository } from '../repositories';


@Injectable()
export class UsersService {
  constructor(
    public usersRepository: UsersRepository,
    public userRolesRepository: UserRolesRepository
  ) { }

  async findAll(): Promise<UserResponseModel> {
    const users: any = await this.usersRepository.findAll();
    return { success: true, data: users }
  }

  async findOne(_id): Promise<UserResponseModel> {
    const user = await this.usersRepository.findOne({ attributes: ['id', 'firstname', 'secondname', 'email'], where: { id: _id } });
    return { success: true, data: user }
  }

  async changeAvatar(id, avatar): Promise<UserResponseModel> {
    await this.usersRepository.update(avatar, id)
    return { success: true, data: avatar.imageProfile }
  }

  async getAvatar(_id): Promise<UserResponseModel> {
    const users: any = await this.usersRepository.findOne({ attributes: ['imageProfile'], where: { id: _id } });
    const avatar = users.dataValues.imageProfile
    return { success: true, data: avatar }
  }

  async delete(_id): Promise<UserResponseModel> {
    await this.userRolesRepository.destroyUserRoles({ where: { users_id: _id } })
    await this.usersRepository.destroyUsers({ where: { id: _id } })
    return { success: true }
  }

  async update(user, id): Promise<UserResponseModel> {
    await this.usersRepository.update(user, id)
    return { success: true }
  }

  async registerNewUser(user): Promise<UserResponseModel> {
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
  
      if(!inpRegExpr.test(user.firstname)){
          errorObj.errorFirstname = 'Error: допустимы буквы латинского алфавита менее 3-х';
      }else{++stateValid}
      if(!inpRegExpr.test(user.secondname)){
          errorObj.errorSecondname = 'Error: допустимы буквы латинского алфавита менее 3-х';
      }else{++stateValid}
      if(!emailRegExpr.test(user.email)){
          errorObj.errorEmail = 'Error: uncorrectEmail value!';
      }else{++stateValid}
      if(!passWordExpr.test(user.password)){
          errorObj.errorPassword = 'Error: допустимы цифры не менее 3-х';
      }else{++stateValid}

      if(stateValid === 4){
        const newUser: any = {
          id: null,
          firstname: user.firstname,
          secondname: user.secondname,
          password: await bcrypt.hash(user.password, 10),
          email: user.email,
          imageProfile: user.imageProfile
        };
        const matchUser: any = await this.usersRepository.findOne({ where: { email: newUser.email } })
        if (!matchUser) {
          await this.usersRepository.create(newUser)
  
          const user: any = await this.usersRepository.findOne({ attributes: ['id'], where: { email: newUser.email } })
          const newId = user.dataValues.id
          const newRole = {
            users_id: newId,
            roles_id: 2
          }
          await this.userRolesRepository.create(newRole)
           return { success: true, message: 'User Successfully created' }
        } else return { success: false, errorValid: false, message: `User with E-mail:${matchUser.email} alredy exist!` }
    }else{
      return { success: false, errorValid: true, data: errorObj }
    }
  }
}