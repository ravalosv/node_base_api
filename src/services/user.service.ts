import { UserModel } from "../data/models/models";

//import UserModel from "../data/models/user.model";

export const getUsers = async ({ filter = "" }: { filter?: string } = {}) => {
  // Define el objeto where basado en el filtro
  let whereCondition = {};
  if (filter === "active") {
    whereCondition = { isDisabled: false };
  } else if (filter === "inactive") {
    whereCondition = { isDisabled: true };
  }

  // Realiza una única consulta a la base de datos
  const users = await UserModel.findAll({ where: whereCondition, include: ["grupo"] });

  // Mapea los usuarios para eliminar la contraseña
  const usersList = users.map((user) => {
    const { password: passHash, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  });

  return usersList;
};

export const getUserById = async (id: any) => {
  const userFound = await UserModel.findByPk(id, { include: ["unidadesNegocio"] });

  const { password: passHash, ...userWithoutPassword } = userFound!.toJSON();

  return userWithoutPassword;
};

export const updateUser = async (id: any, { name, role, unidadesNegocio, grupoId }: any) => {
  const t = await UserModel.sequelize!.transaction();
  try {
    const userFound = await UserModel.findByPk(id);

    if (!userFound) {
      throw new Error("USER_NOT_FOUND");
    }

    const updatedUser = await userFound.update(
      {
        name,
      },
      { transaction: t }
    );

    /*     await UserUnidadNegocioModel.destroy({ where: { userId: id }, transaction: t });

    const promises = unidadesNegocio!.map((unidadNegocioId: any) => {
      return UserUnidadNegocioModel.create({ userId: id, unidadNegocioId: unidadNegocioId.id }, { transaction: t });
    });

    await Promise.all(promises); */

    const { password: pass, ...userWithoutPassword } = updatedUser.toJSON();

    await t.commit();
    return userWithoutPassword;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

export const disableUser = async (userId: string) => {
  const user = await UserModel.findByPk(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  await user.update({ isDisabled: true });

  const { password: passHash, ...userWithoutPassword } = user.toJSON();

  return userWithoutPassword;
};

export const activateUser = async (userId: string) => {
  const user = await UserModel.findByPk(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  await user.update({ isDisabled: false });

  const { password: passHash, ...userWithoutPassword } = user.toJSON();

  return userWithoutPassword;
};
