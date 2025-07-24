import '../../styles/ui/biggerButton.css'

function biggerButton({ buttontype, buttonMenssage }) {
  return ( 
    <button type={buttontype || "button"} className='biggerButton'> 
      {buttonMenssage}
    </button>
);
}

export default biggerButton;