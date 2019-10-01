import { Sequelize } from 'sequelize-typescript';
import { books } from '../entities';
import { users, users_roles, roles } from '../entities';
import env from '../config/config'
 
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

      sequelize.addModels([books, users, users_roles, roles]);
      await sequelize.sync();
      return sequelize;
    },
  }
]; 