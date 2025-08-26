import prisma from "../prisma.js";

const selectPublic = {
  id: true,
  name: true,
  email: true,
  registeredAt: true,
  fullName: true,
  phone: true,
  city: true,
  state: true,
  passwordHash: true,
};

export const getAllUsuarios = async () => {
  return prisma.account.findMany({
    orderBy: {
      name: "desc",
    },
    select: selectPublic,
  });
};

export const getUsuarioById = async (id) => {
  return prisma.account.findUnique({
    where: {
      id: Number(id),
    },
    select: selectPublic,
  });
};

export const addUsuario = async (
  name,
  fullName,
  email,
  phone,
  city,
  state,
  encryptedPassword
) => {
  return prisma.account.create({
    data: {
      name,
      fullName,
      email,
      phone,
      city,
      state,
      registeredAt: new Date(),
      passwordHash: encryptedPassword,
    },
    select: selectPublic,
  });
};

export const updateUsuario = async (
  id,
  nome,
  fullName,
  email,
  phone,
  city,
  state,
  passwordHash
) => {
  const usuario = await prisma.account.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }
  return prisma.account.update({
    where: {
      id: Number(id),
    },
    data: {
      name: nome,
      fullName: fullName,
      email: email,
      phone: phone,
      city: city,
      state: state,
      passwordHash: passwordHash,
    },
    select: selectPublic,
  });
};

export const deleteUsuario = async (id) => {
  const usuario = await prisma.account.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }
  return prisma.account.delete({
    where: {
      id: Number(id),
    },
  });
};

export const getUsuarioByEmail = async (email) => {
  return prisma.account.findUnique({
    where: {
      email: String(email),
    },
    select: selectPublic,
  });
};

export const userAuth = (email) => {
  return prisma.account.findUnique({
    where: {
      email: String(email),
    },
    select: selectPublic,
  });
};
