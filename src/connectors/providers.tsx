import { InjectedConnector } from "@web3-react/injected-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { isProduction } from "src/utils/misc";

const RPC_URL: any = isProduction()
  ? { [1]: "https://mainnet.infura.io/v3/62302e9d9b074d8baa2344a5550b6cc9" }
  : { [42]: "https://kovan.infura.io/v3/62302e9d9b074d8baa2344a5550b6cc9" };

const API_KEY: any = isProduction() ? "pk_live_F95FEECB1BE324B5" : "pk_test_C102027C0649EF66";
const SUPPORTED_CHAIN_ID = isProduction() ? 1 : 42;

export enum SupportedChainId {
  MAINNET = 1,
  KOVAN = 42,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: "mainnet",
  [SupportedChainId.KOVAN]: "kovan",
};

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === "number"
) as SupportedChainId[];

export const injected = new InjectedConnector({
  supportedChainIds: [SUPPORTED_CHAIN_ID],
});

export const fortmatic = new FortmaticConnector({
  apiKey: API_KEY,
  chainId: SUPPORTED_CHAIN_ID,
});

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URL,
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  qrcode: true,
});
