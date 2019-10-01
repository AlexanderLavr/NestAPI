import { Sequelize } from 'sequelize-typescript';
import { Books } from '../entities';
import { Users, Users_roles, Roles } from '../entities';
import env from '../environment/config'
 
export const databaseProviders = [

  {
    provide: 'SEQUELIZE',

    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',   
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        define: {
          timestamps: false
        }
      });

      sequelize.addModels([Books, Users, Users_roles, Roles]);
      await sequelize.sync();
      return sequelize;
    },
  }
]; 