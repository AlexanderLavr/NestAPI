import { Sequelize } from 'sequelize-typescript';
import { books } from '../books/books.entity';
import { users, users_roles, roles } from '../users/users.entity';
import env from '../config/config'


export const databaseProviders = [

  {
    provide: 'SEQUELIZE',

    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',   
        host: '127.0.0.1',
        port: 3306,
        username: 'newuser',
        password: '1111',
        database: "db",
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