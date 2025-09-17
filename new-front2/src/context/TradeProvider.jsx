// Caminho do arquivo: src/context/TradeProvider.jsx

// @refresh reset
// Provider responsável por carregar/atualizar as propostas e expor a API.
// Continua chamando o "repositório/serviço" para CRUD, mas concentra o state aqui.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TradeContext } from "./TradeContext";

import { KEY as TRADE_STORAGE_KEY } from "../repositories/tradeRepository";
// 👉 Você pode importar do repositório OU do services/trades (que reexporta o repo)
import {
  createProposal,
  listReceived,
  listSent,
  updateStatus,
  removeProposal,
} from "../services/trades";

const STORAGE_KEY = TRADE_STORAGE_KEY;

export function TradeProvider({ children }) {
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);

  const refresh = useCallback(async () => {
    const r = await listReceived();
    const s = await listSent();
    setReceived(r);
    setSent(s);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // sincroniza entre abas (quando localStorage mudar)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const value = useMemo(
    () => ({
      received,
      sent,
      refresh,
      create: async (payload, opts) => {
        const p = await createProposal(payload, opts);
        await refresh();
        return p;
      },
      accept: async (id) => {
        await updateStatus(id, "aceito");
        await refresh();
      },
      decline: async (id) => {
        await updateStatus(id, "recusado");
        await refresh();
      },
      cancel: async (id) => {
        await updateStatus(id, "cancelado");
        await refresh();
      },
      remove: async (id) => {
        await removeProposal(id);
        await refresh();
      },
    }),
    [received, sent, refresh]
  );

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>;
}

export default TradeProvider;
