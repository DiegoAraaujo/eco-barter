import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Form from "../components/layout/Form";
import "../styles/addItem.css";
import { useUserContext } from "../contexts/UserContext";
function AddItem() {
  const { user } = useUserContext();
  return (
    <>
      <div className="add-item-container">
        <div className="cover">
          <Form />
        </div>
      </div>
    </>
  );
}
export default AddItem;
