
import "../../styles/smallerButton.css"


function smallerButton({ buttontype, buttonMessage }) {
  return ( 
    <button type={buttontype || "button"} className='smallerButton'> 
      {buttonMessage}
    </button>
);
}


export default smallerButton;


