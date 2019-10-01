import { Injectable } from '@nestjs/common';
import { Users } from '../entities';
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

  async findAll(res): Promise<Users[]> {
    const users: any = await this.UsersRepository.findAll();
    if (users.length !== 0) {
      return res.status(200).send({
        success: true,
        data: users
      });
    } else {
      return res.status(204).send({
        success: false,
        message: 'Users not found',
        data: null
      });
    }
  }

  async findOne(req, res): Promise<Users[]> {
    let role = await getRole(req.headers.authorization);
    if(role.isAdmin === 'admin'){
      const user = await this.UsersRepository.findOne({ attributes: ['id', 'firstname', 'secondname', 'email'], where: { id: req.params.id } });
      if (user) {
        return res.status(200).send({
          success: true,
          data: user
        });
      } else {
        return res.status(204).send({
          success: false,
          message: 'Requset body is incorrect!',
          data: null
        });
      }
    }
  }

  async changeAvatar(req, res): Promise<Users[]> {
    let id = req.params.id
    const users = await this.UsersRepository.findOne({ where: { id: id } });
    if (users) {
      await this.UsersRepository.update(req.body, id)
      return res.status(200).send({
        success: true,
        data: req.body.imageProfile
      });
    } else {
      return res.status(204).send({
        success: false,
        message: 'Requset body is incorrect!',
        data: null
      });
    }
  }

  async getAvatar(req, res): Promise<any> {
    const users: any = await this.UsersRepository.findOne({ attributes: ['imageProfile'], where: { id: req.params.id } });
    const avatar = users.dataValues.imageProfile
      res.status(200).send({
        success: true,
        data: avatar
      });
  }

  async delete(req, res): Promise<UserResponseModel> {
    let role = await getRole(req.headers.authorization);
    if(role.isAdmin === 'admin'){
      const check = await this.UsersRepository.findOne({ where: { id: req.params.id } })
      if (check) {
        await this.UserRolesRepository.destroyUserRoles({ where: { users_id: req.params.id } })
        await this.UsersRepository.destroyUsers({ where: { id: req.params.id } })
        return res.status(200).send({
          success: true,
          message: 'Delete is done'
        });
      } else {
        return res.status(204).send({
          success: false,
          message: 'Requset body is incorrect!',
          data: null
        });
      }
    }
  }

  async update(req, res): Promise<UserResponseModel> {
    const check = await this.UsersRepository.findOne({ where: { id: req.params.id } });
    if (check) {
      await this.UsersRepository.update(req.body, req.params.id)
      return res.status(200).send({
        success: true,
        message: 'Update is done'
      });
    } else {
      return res.status(204).send({
        success: false,
        message: 'Requset body is incorrect!',
        data: null
      });
    }
  }

  async registerNewUser(req, res): Promise<UserResponseModel> {
      const registerObj = req.body;
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
          firstname: req.body.firstname,
          secondname: req.body.secondname,
          password: await bcrypt.hash(req.body.password, 10),
          email: req.body.email,
          imageProfile: req.body.imageProfile
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
          res.status(200).send({
            success: true,
            message: "User Successfully created"
          });
        } else return res.status(401).send({
          success: false,
          errorValid: false,
          message: `User with E-mail:${matchUser.email} alredy exist!`
        });
    }else{
      res.status(401).send({
        success: false,
        errorValid: true,
        data: errorObj
      });
    }
  }
}