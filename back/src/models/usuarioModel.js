const prisma = require('../prisma');


const selectPublic = {
  id: true,
  name: true,
  email: true,
  registeredAt: true,
  fullName: true,
  phone: true,
  city: true,
  state: true,
};

const getAllUsuarios = async() => {
    return prisma.account.findMany({
        orderBy: {
            name: 'desc'
        },
        select: selectPublic,
    });
}
const getUsuarioById = async(id) => {
    return prisma.account.findUnique({
        where: {
            id: Number(id)
          },
          select: selectPublic,
    });
}

const addUsuario = async(nome, fullName, email, phone, city, state ) => {
    return prisma.account.create({
        data:{
            name: nome,
            fullName: fullName,
            email: email,
            phone: phone,
            city: city,
            state: state,
            registeredAt: new Date(),
            }, 
            select: selectPublic,
    });
}
   const updateUsuario = async(id, nome, fullName, email, phone, city, state) => {    
    const usuario = await prisma.account.findUnique({
        where: {
            id: Number(id)
        }
    });
    if(!usuario){
        throw new Error('Usuário não encontrado');
    }
    return prisma.account.update({
        where: {
            id: Number(id)

        },
        data: {
            name: nome,
            fullName: fullName,
            email: email,
            phone: phone,
            city: city,
            state: state,
            
        },
        select: selectPublic,

    });
}

const deleteUsuario = async(id) => {
    const usuario = await prisma.account.findUnique({
        where:{
            id: Number(id)
        }

    });
    if(!usuario){
        throw new Error('Usuário não encontrado');
    }
    return prisma.account.delete({
        where: {
            id: Number(id)
        }
    });
}
module.exports = {
    getAllUsuarios,
    getUsuarioById,
    addUsuario,
    updateUsuario,
    deleteUsuario
};