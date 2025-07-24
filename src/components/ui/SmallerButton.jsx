import '../../styles/smallerButton.css'

function smallerButton({ buttontype, buttonMenssage }) {
  return ( 
    <button type={buttontype || "button"} className='smallerButton'> 
      {buttonMenssage}
    </button>
);
}

export default smallerButton;
