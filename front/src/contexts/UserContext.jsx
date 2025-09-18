import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export const UserContext = createContext(null);

export const useUserContext = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/usuarios/me");
        setUser(response.data);
        setReady(true);
      } catch (error) {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
