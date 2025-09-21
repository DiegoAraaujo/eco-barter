import EditForm from "../components/layout/EditForm";
import "../styles/editItem.css";
import { useUserContext } from "../contexts/UserContext";
function AddItem() {
  const { user } = useUserContext();
  return (
    <>
      <div className="add-item-container">
        <EditForm />
      </div>
    </>
  );
}
export default AddItem;
