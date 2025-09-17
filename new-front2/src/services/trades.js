// Caminho do arquivo: src/services/trades.js

// Reexporta a interface do repositório (retrocompatibilidade com o app atual)

export {
  createProposal,
  listReceived,
  listSent,
  updateStatus,
  removeProposal,
} from "../repositories/tradeRepository";
