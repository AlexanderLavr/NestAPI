import { Module } from '@nestjs/common';
import { DatabaseModule } from './db.connection/db-module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from './environment/config.module';

import { authProviders, booksProviders, usersProviders, rolesProviders, usersrolesProviders} from './providers';
import { AuthController, UsersController, BooksController } from './controllers';
import { AuthService, BooksService, UsersService } from './services';

import { LocalStrategy, JwtStrategy } from './common';

import { jwtConstants } from './secrets/jwtSecretKey';



@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),],
  controllers: [BooksController, UsersController, AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    BooksService,
    ...booksProviders,
    UsersService,
    ...usersProviders,
    AuthService,
    ...authProviders,
    ...rolesProviders,
    ...usersrolesProviders
  ]
}
)
export class AppModule { }
