import ImgCamiseta from "../assets/camiseta.png";
import ImgDisco from "../assets/disco.png";
import ImgLiqui from "../assets/Liqui.png";
import ImgLivro from "../assets/livro.png";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

import CardMyProduct from "../components/ui/CardMyProduct";
import "../styles/myArea.css";
import SmallerButton from '../components/ui/SmallerButton'

function MyArea () {
    return(
        <>
        <main>
<Header />
        <h1> Minha Área</h1>
        <section className="items-section">
              <div className="items-wrapper">
                     <h2>  Meus itens Cadastrados </h2>
    
     <div className="grid-items">
       
        <CardMyProduct image={ ImgCamiseta}
 imageDescription="Camisa" productName="Camiseta" category="Roupas" productState="Disponível"  >  
 <div>
  <SmallerButton buttonMessage="Editar" />
   <SmallerButton buttonMessage="Remover" />
   </div>
  </CardMyProduct>

  
        <CardMyProduct image={ ImgDisco}
 imageDescription="Disco" productName="Disco de vinil" category="Acessórios" productState="Disponível" > 
 <div>
  <SmallerButton buttonMessage="Editar" />
   <SmallerButton buttonMessage="Remover" />
   </div>

   </CardMyProduct>
 
        <CardMyProduct image={ ImgLiqui}
 imageDescription="Liquidificador" productName="Liquidificador" category="Eletrodoméstico" productState="Disponível">   
 <div>
  <SmallerButton buttonMessage="Editar" />
   <SmallerButton buttonMessage="Remover" />
   </div>
   </CardMyProduct>

         <CardMyProduct image={ ImgLivro}
 imageDescription="Livro" productName="Livro A Bela e a Ferra" category="Livros" productState="Disponível" >   
  <div>
  <SmallerButton buttonMessage="Editar" />
   <SmallerButton buttonMessage="Remover" />
   </div>
   </CardMyProduct>

 
    {/*       <CardMyProduct image={ ImgLiqui}
        
 imageDescription="Liquidificador"  productName="Liquidificador" category="Eletrodoméstico" productState="Disponível"  >   
   <div>
  <SmallerButton buttonMessage="Editar" />
   <SmallerButton buttonMessage="Remover" />
   </div>  
   </CardMyProduct>

    <CardMyProduct image={ ImgLivro}
 imageDescription="Livro" productName="Livro A Bela e a Ferra" category="Livros" productState="Disponível" >  
 <div>
  <SmallerButton buttonMessage="Editar" />
   <SmallerButton buttonMessage="Remover" />
   </div>
  </CardMyProduct>*/}
 
           
           
        
        
            

      
</div>
       </div>
          
        
        </section>
 <Footer />
        </main>
        </>

    )

}

export default MyArea;