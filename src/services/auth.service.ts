import { IUser } from "../data/interfaces/user.interface";
import { encrypt, verify } from "../core/utils/bcrypt.handle";
import { generateRefreshToken, generateToken, verifyToken } from "../core/utils/jwt.handle";
import { RequestExt } from "../data/interfaces/requestExt.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import eventosDB from "../core/dbconfig/mariadb";
import { UserModel } from "../data/models/models";
import { IAuth } from "../data/interfaces/auth.interface";

// REGISTER NEW USER
export const registerNewUser = async (userId: number, { email, password, name }: IUser) => {
  const t = await eventosDB.transaction();
  try {
    const checkIs = await UserModel.findOne({ where: { email } });
    if (checkIs) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const passHash = await encrypt(password);
    const registerNewUser = await UserModel.create(
      {
        email,
        password: passHash,
        name,
        isDisabled: false,
        createdByUserId: userId,
      },
      { transaction: t }
    );

    /*     const promises = unidadesNegocio!.map((unidadNegocioId: any) => {
      return UserUnidadNegocioModel.create({ userId: registerNewUser.id, unidadNegocioId: unidadNegocioId.id }, { transaction: t });
    });

    await Promise.all(promises); */

    const { password: pass, ...userWithoutPassword } = registerNewUser.toJSON();

    await t.commit();
    return userWithoutPassword;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

// LOGIN USER
export const loginUser = async ({ email, password }: IAuth) => {
  const checkIs = await UserModel.findOne({ where: { email, isDisabled: false }, include: ["unidadesNegocio"] });
  if (!checkIs) {
    return "USER_PASSWORD_WRONG";
  }

  const { password: passHash, ...userWithoutPassword } = checkIs.toJSON();

  const isCorrect = await verify(password, passHash);

  if (!isCorrect) {
    return "USER_PASSWORD_WRONG";
  }

  const token = await generateToken(userWithoutPassword.id!.toString(), userWithoutPassword.email);
  const refreshToken = await generateRefreshToken(userWithoutPassword.id!.toString(), userWithoutPassword.email);

  const data = {
    user: userWithoutPassword,
    token,
    refreshToken,
  };

  return data;
};

// Obtener el userId a partir del token
export const getUserId = (req: RequestExt) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw "No token provided.";
  }

  // Decodificar el token
  const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || "");
  // Obtener el userId
  const userId = decodedToken.id;
  return userId;
};

export const getCurrentUser = async (req: RequestExt) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw "No token provided.";
  }

  // Decodificar el token
  const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET || "");

  decodedToken.id;

  const currentUser = await UserModel.findOne({
    where: { id: decodedToken.id }, // Asume que userId es el ID del usuario que estás buscando
  });

  return currentUser?.toJSON();
};

export const changePassword = async (userId: number, newPassword: any) => {
  const user = await UserModel.findByPk(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const { password: passHash, ...userWithoutPassword } = user.toJSON();

  const newPassHash = await encrypt(newPassword);

  await user.update({ password: newPassHash });

  return userWithoutPassword;
};

export const renewToken = async (renewToken: string) => {
  const ret = await verifyToken(renewToken);

  if (!ret.success) {
    throw new Error("invalid token");
  }

  const tokenData = ret.data as JwtPayload;

  // cargar datos del usuario
  const checkIs = await UserModel.findOne({ where: { id: tokenData.id }, include: ["unidadesNegocio"] });

  if (!checkIs) {
    throw new Error("invalid token: user not found");
  }

  const { password: passHash, ...userWithoutPassword } = checkIs.toJSON();

  const token = await generateToken(tokenData.id, tokenData.email);
  const refreshToken = await generateRefreshToken(tokenData.id, tokenData.email);

  const data = {
    user: userWithoutPassword,
    token,
    refreshToken,
  };

  return data;
};
