import { DataTypes, Model } from "sequelize";
import eventosDB from "../../core/dbconfig/mariadb";
import { IUser } from "../interfaces/user.interface";
import { IRole } from "../interfaces/role.interface";

// Define el modelo usando la interfaz
export class UserModel extends Model<IUser> implements IUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public createdByUserId!: number;
  public isDisabled!: boolean;
}

// Define la estructura del modelo en Sequelize
UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdByUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize: eventosDB,
    modelName: "User", // nombre del modelo
    tableName: "usuarios",
    timestamps: true, // si no necesitas createdAt y updatedAt
  }
);

export class RoleModel extends Model<IRole> {
  public id!: number;
  public name!: string;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: eventosDB,
    modelName: "Role",
    tableName: "roles",
    timestamps: false,
  }
);

/* RELACIONES */

// Establecer relacion muchos a muchos entre User y Role
UserModel.belongsToMany(RoleModel, { through: "UserRole", foreignKey: "userId" });
RoleModel.belongsToMany(UserModel, { through: "UserRole", foreignKey: "roleId" });
