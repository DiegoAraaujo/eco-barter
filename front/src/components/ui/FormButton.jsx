import '../../styles/formButton.css'

function FormButton({ buttontype, buttonMessage, onClick }) {
  return ( 
    <button type={buttontype || "submit"} className='formButton' onClick={onClick}> 
      {buttonMessage}
    </button>
);
}

export default FormButton;