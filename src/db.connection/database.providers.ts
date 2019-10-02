import { Sequelize } from 'sequelize-typescript';
import { User, User_Role, Role, Book } from '../entities';
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

      sequelize.addModels([User, User_Role, Role, Book]);
      await sequelize.sync();
      return sequelize;
    },
  }
]; 