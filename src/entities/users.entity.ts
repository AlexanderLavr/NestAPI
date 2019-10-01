import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';


@Table
export class Users_roles extends Model<Users_roles> {

  @ForeignKey(() => Users)
  @Column
  users_id: Number;

  @ForeignKey(() => Roles)
  @Column
  roles_id: Number;
}


@Table
export class Users extends Model<Users> {
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

  @BelongsToMany(() => Roles, () => Users_roles)
  dataRoleId: Users_roles[];
}

@Table
export class Roles extends Model<Roles> {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: 'id',
  })
  id: Number;

  @Column
  roleName: String


  @BelongsToMany(() => Users, () => Users_roles)
  dataRole: String[];
}

