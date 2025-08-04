export const mockItems = [
  // 1. Livros
  {
    id: "1",
    title: "Box Harry Potter - Coleção Completa",
    category: "Livros",
    city: "São Paulo",
    description: "Coleção completa dos 7 livros da saga Harry Potter, edição de capa dura. Excelente estado de conservação.",
    image: "/img/harry-potter-box.png",
    condition: "Usado - Como novo",
    owner: "user101",
    createdAt: "2023-10-05"
  },

  // 2. Eletrodomésticos
  {
    id: "2",
    title: "Geladeira Frost Free Brastemp",
    category: "Eletrodomésticos",
    city: "Rio de Janeiro",
    description: "375L, branca, com dispenser de água na porta. Funcionando perfeitamente.",
    image: "/img/geladeira-brastemp.png",
    condition: "Usado - Boas condições",
    owner: "user102",
    createdAt: "2023-09-15"
  },

  // 3. Roupas
  {
    id: "3",
    title: "Blazer Masculino Tamanho 42",
    category: "Roupas",
    city: "Belo Horizonte",
    description: "Blazer social azul marinho, marca Reserva. Usado poucas vezes.",
    image: "/img/blazer-reserva.png",
    condition: "Usado - Excelente estado",
    owner: "user103",
    createdAt: "2023-11-10"
  },

  // 4. Calçados
  {
    id: "4",
    title: "Tênis Nike Air Max Tamanho 40",
    category: "Calçados",
    city: "Porto Alegre",
    description: "Tênis preto e branco, pouco usado. Solado em perfeito estado.",
    image: "/img/tenis-nike.png",
    condition: "Usado - Como novo",
    owner: "user104",
    createdAt: "2023-08-22"
  },

  // 5. Móveis
  {
    id: "5",
    title: "Sofá 3 Lugares Retrátil",
    category: "Móveis",
    city: "Curitiba",
    description: "Sofá em couro sintético red, com assento retrátil. Alguns sinais de uso.",
    image: "/img/sofa-red.png",
    condition: "Usado - Boas condições",
    owner: "user105",
    createdAt: "2023-07-30"
  },

  // 6. Esportes
  {
    id: "6",
    title: "Kit de Pesca Completo",
    category: "Esportes",
    city: "Recife",
    description: "Inclui vara, carretilha, anzóis e acessórios. Ideal para iniciantes.",
    image: "/img/kit-pesca.png",
    condition: "Usado - Bom estado",
    owner: "user106",
    createdAt: "2023-10-18"
  },

  // 7. Informática
  {
    id: "7",
    title: "Notebook Dell i5 8GB RAM",
    category: "Informática",
    city: "Salvador",
    description: "SSD 256GB, tela 15.6 Funcionando perfeitamente, bateria com boa duração.",
    image: "/img/notebook-dell.png",
    condition: "Usado - Excelente estado",
    owner: "user107",
    createdAt: "2023-09-05"
  },

  // 8. Celulares
  {
    id: "8",
    title: "iPhone 11 64GB",
    category: "Celulares",
    city: "Fortaleza",
    description: "Cor vermelha, com capa protetora e película. 100% funcional.",
    image: "/img/iphone11.png",
    condition: "Usado - Como novo",
    owner: "user108",
    createdAt: "2023-11-02"
  },

  // 9. Brinquedos
  {
    id: "9",
    title: "Carrinho de Controle Remoto",
    category: "Brinquedos",
    city: "Brasília",
    description: "Bateria recarregável, controle remoto incluso. Funcionando perfeitamente.",
    image: "/img/carrinho-rc.png",
    condition: "Usado - Bom estado",
    owner: "user109",
    createdAt: "2023-10-12"
  },

  // 10. Jardinagem
  {
    id: "10",
    title: "Kit Jardinagem",
    category: "Jardinagem",
    city: "Florianópolis",
    description: "Inclui tesoura de poda, ancinho, pá e luvas. Todos itens em bom estado.",
    image: "/img/kit-jardinagem.png",
    condition: "Usado - Boas condições",
    owner: "user110",
    createdAt: "2023-09-28"
  }
];

export const getItemById = (id) => {
  return mockItems.find(item => item.id === id) || null;
};

export const getItemsByCategory = (category) => {
  return mockItems.filter(item => item.category === category);
};