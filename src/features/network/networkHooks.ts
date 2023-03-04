import { RenNetwork } from "@renproject/utils";
import { getDefaultChains, ChainInstanceMap } from "src/utils/chains";

const chainsCache: Partial<Record<RenNetwork, ChainInstanceMap>> = {};
if (typeof window !== "undefined") (window as any).chainsCache = chainsCache;

export const useChains = (network: RenNetwork) => {
  if (!chainsCache[network]) {
    chainsCache[network] = getDefaultChains(network);
  }
  return chainsCache[network] as ChainInstanceMap;
};
