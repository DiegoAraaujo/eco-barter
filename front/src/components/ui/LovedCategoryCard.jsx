import '../../styles/lovedCategoryCard.css'

function LovedCategoryCard({category, image, imageDescription}){
  return (
    <div className='category'>
      <img src={image} alt={imageDescription} />
      <p>{category}</p>
    </div>
  )
}

export default LovedCategoryCard;