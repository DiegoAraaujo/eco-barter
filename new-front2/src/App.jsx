// src/App.jsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { TradeProvider } from "./context/TradeProvider";
import { AuthProvider } from "./context/AuthContext"; 

function App() {
  return (
    <AuthProvider>
      <TradeProvider>
        <RouterProvider router={router} />
      </TradeProvider>
    </AuthProvider>
  );
}

export default App;



//AuthProvider fornece autenticação global.
//TradeProvider gerencia as trocas.
//RouterProvider continua cuidando das rotas normalmente.