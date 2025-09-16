import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CardMyProduct from "../components/ui/CardMyProduct";
import SmallerButton from "../components/ui/SmallerButton";
import "../styles/myArea.css";

import { useState  } from "react";

function MyArea() {
  
  const items = [
   {
      id: 1,
      name: "Blazer Masculino Tamanho 42",
      imageUrl:
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop",
      category: "Roupas",
      status: "Disponível",
    },
    {
      id: 1,
      name: "Blazer Masculino Tamanho 42",
      imageUrl:
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop",
      category: "Roupas",
      status: "Disponível",
    },
      {
      id: 1,
      name: "Blazer Masculino Tamanho 42",
      imageUrl:
        "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1200&auto=format&fit=crop",
      category: "Roupas",
      status: "Disponível",
    },
     
  ];

  return (
    <>
      <main>
        <Header />
        <h1>Minha Área</h1>

        <section className="items-section">
          <div className="items-wrapper">
            <h2>Meus itens cadastrados</h2>

            {items.length === 0 ? (
             
              <div className="empty-state">
                <p>Você ainda não cadastrou itens.</p>
              </div>
            ) : (
              <div className="grid-items">
                {items.map((item) => (
                  <CardMyProduct
                    key={item.id}
                    image={item.imageUrl}
                    imageDescription={item.name}
                    productName={item.name}
                    category={item.category}
                    productState={item.status} 
                  >
                    <div>
                      <SmallerButton buttonMessage="Editar" />
                      <SmallerButton buttonMessage="Remover" />
                    </div>
                  </CardMyProduct>
                ))}
              </div>
            )}
          </div>
        </section>

      
      </main>
       <Footer />
    </>
  );
}

export default MyArea;