import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Users, Roles } from '../entities';

@Injectable()
export class AuthRepository {
    @Inject('AUTH_REPOSITORY') public AUTH_REPOSITORY: typeof Users

    async findOneEmail(email: string) {
        const user = await this.AUTH_REPOSITORY.findOne<Users>({ where: { email: email } })
        return user
    }

    async comparePassword(password: string, userPassword: string) {
        const matchPasswords = await bcrypt.compare(password, userPassword);
        return matchPasswords
    }

    async findAllRore(userId, permissions){
        await this.AUTH_REPOSITORY.findAll<Users>({
               where: { id: userId },
               include: [{
                 model: Roles,
              }]
            }).then((rolen: any) => rolen.forEach(el => {
                el.dataRoleId.forEach(element => {
                  permissions.push(element.dataValues.roleName);
                });
            }))
        return permissions
    }
}