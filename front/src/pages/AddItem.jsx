import Form from "../components/layout/Form";
import "../styles/addItem.css";
import { useUserContext } from "../contexts/UserContext";
function AddItem() {
  const { user } = useUserContext();
  return (
    <>
      <div className="add-item-container">
        <Form />
      </div>
    </>
  );
}
export default AddItem;
