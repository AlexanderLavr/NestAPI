import { Injectable, Inject } from '@nestjs/common';
import { User_Role, User } from '../entities';


@Injectable()
export class UsersRepository {
    @Inject('USERS_REPOSITORY') public USERS_REPOSITORY: typeof User
    
    async findAll(){
        return this.USERS_REPOSITORY.findAll<User>();
    }
    async findOne(parametrs: any){
        return this.USERS_REPOSITORY.findOne<User>(parametrs);
    }
    async update(body: User, id: string){
        return this.USERS_REPOSITORY.update<User>(body, { where: { id: id } });
    }
    async destroyUsers(parametrs: any){
        return this.USERS_REPOSITORY.destroy(parametrs)
    }
    async create(newUser: User){
        return this.USERS_REPOSITORY.create<User>(newUser);
    }
}

@Injectable()
export class UserRolesRepository {
    @Inject('USER_ROLES_REPO') public USER_ROLES_REPO: typeof User_Role
    
    async destroyUserRoles(parametrs: any){
        return this.USER_ROLES_REPO.destroy(parametrs)
    }
    async create(newRole: any){
        return this.USER_ROLES_REPO.create<User_Role>(newRole);
    }
}