import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";

import { UserContext } from "./contexts/UserContext";
import WelcomePage from "./pages/WelcomePage";
import Login from "./pages/Login";
import MyArea from "./pages/MyArea";

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myarea" element={<MyArea />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
