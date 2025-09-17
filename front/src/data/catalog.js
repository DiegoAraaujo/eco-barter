import ImgCamisa from "../assets/image.svg";

export const catalog = [

  {
    id: 1,
    name: "temis",
    email: "aaaa_bbbb@gmail.com",
    registeredAt: "2005/08/20",
    passwordHash: "aaabbbccc",
    fullName: "temis handeri alves do amaral santos",
    phone: "(88)99999-8888",
    city: "iguatu",
    state: "ce",
    items: [
      {
        id: 1,
        imageUrl: ImgCamisa,
        nameProduct: "jaqueta",
        location: "Iguatu-CE",
        itemCondition: "new",
        category: "Roupas"
      },
      {
        id: 2,
        imageUrl: ImgCamisa,
        nameProduct: "jaqueta",
        location: "Iguatu-CE",
        itemCondition: "new",
        category: "Brinquedos"
      }
    ]
  },
  {
    id: 2,
    name: "handeri",
    email: "bbbb_aaaa@gmail.com",
    registeredAt: "2005/08/20",
    passwordHash: "aaabbbcccddd",
    fullName: "temis amaral do santos",
    phone: "(88)95555-7777",
    city: "juazeiro",
    state: "ce",
    items: [
      {
        id: 3,
        imageUrl: ImgCamisa,
        nameProduct: "jaqueta",
        location: "Iguatu-CE",
        itemCondition: "new",
        category: "Eletrodomésticos"
      },
      {
        id: 4,
        imageUrl: ImgCamisa,
        nameProduct: "jaqueta",
        location: "Iguatu-CE",
        itemCondition: "new",
        category: "Esportes"
      },
      {
        id: 5,
        imageUrl: ImgCamisa,
        nameProduct: "Geladeira",
        location: "Iguatu-CE",
        itemCondition: "used",
        category: "Eletrodomésticos"
      }
    ]
  }
];
