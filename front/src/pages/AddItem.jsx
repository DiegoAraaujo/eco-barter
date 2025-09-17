import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Form from "../components/layout/Form";
import "../styles/addItem.css";

function AddItem(){
    return(
        <>
            <div className="add-item-container">
               <Header/>
                    <div className="cover">
                        <Form/>
                    </div>                   
               <Footer/> 
            </div>
        </>
    );
}
export default AddItem;