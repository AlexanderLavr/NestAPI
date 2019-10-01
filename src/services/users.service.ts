import { Injectable, Inject } from '@nestjs/common';
import { Users, Users_roles, Roles } from '../entities';
import * as bcrypt from "bcrypt"
import * as jwt from "jwt-then";
import { IsEmail } from 'sequelize-typescript';
import { walidRegister } from '../help/register.valid'
import { getRole } from '../help/actions';


interface UserRes {
  success: boolean
  message?: string
  errorValid?: boolean
  data?: {}
}


@Injectable()
export class UsersService {
  constructor(

    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof Users,
    @Inject('USER_ROLES_REPO') private readonly USER_ROLES_REPO: typeof Users_roles

  ) { }

  async findAll(res): Promise<Users[]> {
    const users: any = await this.USERS_REPOSITORY.findAll<Users>();
    if (users.length !== 0) {
      return res.status(200).send({
        success: true,
        data: users
      });
    } else {
      return res.status(404).send({
        success: false,
        message: 'Users not found',
        data: null
      });
    }
  }
  async findOne(req, res): Promise<Users[]> {
    let role = await getRole(req.headers.authorization);
    if(role.isAdmin === 'admin'){
      const user = await this.USERS_REPOSITORY.findOne<Users>({ attributes: ['id', 'firstname', 'secondname', 'email'], where: { id: req.params.id } });
      if (user) {
        return res.status(200).send({
          success: true,
          data: user
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
    }
  }

  async changeAvatar(req, res): Promise<Users[]> {
    const users: any = await this.USERS_REPOSITORY.findOne<Users>({ where: { id: req.params.id } });
    if (users) {
    await this.USERS_REPOSITORY.update<Users>(req.body, { where: { id: req.params.id } });
      return res.status(200).send({
        success: true,
        data: req.body.imageProfile
      });
    } else {
      return res.status(404).send({
        success: false,
        message: 'Users not found',
        data: null
      });
    }
  }


  async getAvatar(req, res): Promise<any> {
    const users: any = await this.USERS_REPOSITORY.findOne<Users>({ attributes: ['imageProfile'], where: { id: req.params.id } });
    const avatar = users.dataValues.imageProfile
      res.status(200).send({
        success: true,
        data: avatar
      });
  }

  async delete(req, res): Promise<UserRes> {
    let role = await getRole(req.headers.authorization);
    if(role.isAdmin === 'admin'){
      const check = await this.USERS_REPOSITORY.findOne<Users>({ where: { id: req.params.id } });
      if (check) {
        await this.USER_ROLES_REPO.destroy({ where: { users_id: req.params.id } });
        await this.USERS_REPOSITORY.destroy({ where: { id: req.params.id } });
        return res.status(200).send({
          success: true,
          message: 'Delete is done'
        });
      } else {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
    }
  }

  async update(req, res): Promise<UserRes> {
    const check = await this.USERS_REPOSITORY.findOne<Users>({ where: { id: req.params.id } });
    if (check) {
      await this.USERS_REPOSITORY.update<Users>(req.body, { where: { id: req.params.id } });
      return res.status(200).send({
        success: true,
        message: 'Update is done'
      });
    } else {
      return res.status(404).send({
        success: false,
        message: 'User not found',
        data: null
      });
    }
  }

  async registerNewUser(req, res): Promise<UserRes> {
    let valid = await walidRegister(req.body)
      if(valid.stateValid === 4){
        const newUser: any = {
          id: null,
          firstname: req.body.firstname,
          secondname: req.body.secondname,
          password: await bcrypt.hash(req.body.password, 10),
          email: req.body.email,
          imageProfile: req.body.imageProfile
        };
        const matchUser: any = await this.USERS_REPOSITORY.findOne({ where: { email: newUser.email } })
        if (!matchUser) {
          await this.USERS_REPOSITORY.create<Users>(newUser);
  
          const user: any = await this.USERS_REPOSITORY.findOne<Users>({ attributes: ['id'], where: { email: newUser.email } });
          const newId = user.dataValues.id
          const newRole = {
            users_id: newId,
            roles_id: 2
          }
          await this.USER_ROLES_REPO.create<Users_roles>(newRole);
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
        data: valid.errorObj
      });
    }
  }
}