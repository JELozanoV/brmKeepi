import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cancelacionCostosScripts } from "../data/cancelacionCostosScripts";

export interface CancelacionCostoScript {
  id: number;
  reason: string;
  flow: { text: string; type: string }[];
}

export function useRandomCancelacionCostosScript() {
  const [script, setScript] = useState<CancelacionCostoScript | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (cancelacionCostosScripts.length) {
      const randomIndex = Math.floor(Math.random() * cancelacionCostosScripts.length);
      setScript(cancelacionCostosScripts[randomIndex]);
    }
  }, [location.pathname]);

  return script;
}
