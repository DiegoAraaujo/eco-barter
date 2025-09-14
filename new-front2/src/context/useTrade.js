// Caminho do arquivo: src/context/useTrade.js

// Hook para consumir o contexto. Mantém a MESMA assinatura exportada antes.

import React from "react";
import { TradeContext } from "./TradeContext";

export function useTrade() {
  const ctx = React.useContext(TradeContext);
  if (!ctx) {
    throw new Error("useTrade deve ser usado dentro de <TradeProvider>.");
  }
  return ctx;
}

export default useTrade;
