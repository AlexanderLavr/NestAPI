import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';


@Table
export class User_Role extends Model<User_Role> {

  @ForeignKey(() => User)
  @Column
  users_id: Number;

  @ForeignKey(() => Role)
  @Column
  roles_id: Number;
}


@Table
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    field: 'id',
  })
  id: Number;

  @Column
  firstname: String;
  
  @Column
  secondname: String;

  @Column
  password: String;

  @Column
  email: String;

  @Column
  imageProfile: String;

  @BelongsToMany(() => Role, () => User_Role)
  dataRoleId: User_Role[];
}

@Table
export class Role extends Model<Role> {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id',
  })
  id: Number;

  @Column
  roleName: String


  @BelongsToMany(() => User, () => User_Role)
  dataRole: String[];
}

