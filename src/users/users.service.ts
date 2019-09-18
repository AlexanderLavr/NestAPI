import { Injectable, Inject } from '@nestjs/common';
import { users, users_roles, roles } from './users.entity';
import * as bcrypt from "bcrypt"
import * as jwt from "jwt-then";
import { IsEmail } from 'sequelize-typescript';
import { walidRegister } from '../help/register.valid'
import { getRole } from '../help/actions';


@Injectable()
export class UsersService {
  constructor(

    @Inject('USERS_REPOSITORY') private readonly USERS_REPOSITORY: typeof users,
    @Inject('USER_ROLES_REPO') private readonly USER_ROLES_REPO: typeof users_roles

  ) { }

  async findAll(res): Promise<users[]> {
    try {
      const users: any = await this.USERS_REPOSITORY.findAll<users>();
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
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }
  async findOne(req, res): Promise<users[]> {
    let role = await getRole(req.headers.authorization);
    try {
      if(role.isAdmin === 'admin'){
        const user = await this.USERS_REPOSITORY.findOne<users>({ attributes: ['id', 'firstname', 'secondname', 'email'], where: { id: req.params.id } });
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
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async changeAvatar(req, res): Promise<users[]> {
    try {
      const users: any = await this.USERS_REPOSITORY.findOne<users>({ where: { id: req.params.id } });
      if (users) {
      await this.USERS_REPOSITORY.update<users>(req.body, { where: { id: req.params.id } });
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
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }


  async getAvatar(req, res): Promise<any> {
    try {
      const users: any = await this.USERS_REPOSITORY.findOne<users>({ attributes: ['imageProfile'], where: { id: req.params.id } });
      const avatar = users.dataValues.imageProfile
        res.status(200).send({
          success: true,
          data: avatar
        });
    }catch(err){
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async delete(req, res): Promise<any> {
    let role = await getRole(req.headers.authorization);
    try {
      if(role.isAdmin === 'admin'){
        const check = await this.USERS_REPOSITORY.findOne<users>({ where: { id: req.params.id } });
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
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async update(req, res): Promise<any> {
    try {
      const check = await this.USERS_REPOSITORY.findOne<users>({ where: { id: req.params.id } });

      if (check) {

        await this.USERS_REPOSITORY.update<users>(req.body, { where: { id: req.params.id } });
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
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err
      });
    }
  }

  async registerNewUser(req, res): Promise<any> {
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
        try {
          const matchUser: any = await this.USERS_REPOSITORY.findOne({ where: { email: newUser.email } })
          if (!matchUser) {
            await this.USERS_REPOSITORY.create<users>(newUser);
    
            const user: any = await this.USERS_REPOSITORY.findOne<users>({ attributes: ['id'], where: { email: newUser.email } });
            const newId = user.dataValues.id
            const newRole = {
              users_id: newId,
              roles_id: 2
            }
            await this.USER_ROLES_REPO.create<users_roles>(newRole);
            res.status(200).send({
              success: true,
              message: "User Successfully created"
            });
          } else return res.status(401).send({
            success: false,
            errorValid: false,
            message: `User with E-mail:${matchUser.email} alredy exist!`
          });
      } catch (err) {
        res.status(500).send({
          success: false,
          message: 'Register failed try again!'
        });
      }
    }else{
      res.status(401).send({
        success: false,
        errorValid: true,
        data: valid.errorObj
      });
    }
  }
}