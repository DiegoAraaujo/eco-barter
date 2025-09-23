import '../../styles/callSection.css'
import BiggerButton from '../ui/BiggerButton'
import ImgCallSection from '../../assets/image-call-section.svg'
import { Link } from 'react-router-dom'

function callSection (){
  return (
    <section className='call-section'>
      <div className='last-call-container'>
        <div className='call-section-image'>
          <img src={ImgCallSection} alt="" />
        </div>
        <div className='call-section-message'>
          <h2>Comece a transformar sua forma de consumir</h2>
          <p>Cadastre-se agora e descubra como pequenas ações podem gerar grandes mudanças! A EcoBarter conecta você a uma comunidade sustentável e colaborativa. Dê um novo destino ao que você já tem e encontre o que precisa — sem desperdício.</p>
          <Link to="/register">
            <BiggerButton buttonMessage="Quero Me cadastrar"/>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default callSection;