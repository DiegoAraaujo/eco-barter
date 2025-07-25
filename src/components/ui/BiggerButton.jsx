import '../../styles/biggerButton.css'

function biggerButton({ buttontype, buttonMessage }) {
  return ( 
    <button type={buttontype || "button"} className='biggerButton'> 
      {buttonMessage}
    </button>
);
}

export default biggerButton;