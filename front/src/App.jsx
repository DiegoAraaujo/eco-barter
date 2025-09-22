import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { UserProvider } from "./contexts/UserContext";
import WelcomePage from "./pages/WelcomePage";
import Login from "./pages/Login";
import MyArea from "./pages/MyArea";
import PersonalData from "./pages/PersonalData";
import Item from "./pages/Item";
import AddItem from "./pages/AddItem";
import CatalogPage from "./pages/CatalogPage";
import Register from "./pages/Register";
import Footer from "./components/layout/Footer";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import EditItem from "./pages/EditItem";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/myarea" element={<MyArea />} />
            <Route path="/catalogpage" element={<CatalogPage />} />
            <Route path="/personal-data/:id" element={<PersonalData />} />
            <Route path="/item/:id" element={<Item />} />
            <Route path="/additem" element={<AddItem />} />
            <Route path="/edit-item/:id" element={<EditItem />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
