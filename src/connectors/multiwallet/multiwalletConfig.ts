import { Chain } from "@renproject/chains";
import { EthereumInjectedConnector } from "./EthereumConnector";
import { SolanaConnector } from "./SolanaConnector";
import { RenNetwork } from "@renproject/utils";
// import { renNetworkToEthNetwork, ethNetworkToRenNetwork } from "../../utils/networkMapping";
import { Wallet } from "./walletsConfig";
import { EthereumWalletConnectConnector } from "./WalletconnectConnector";
import { EthereumMEWConnectConnector } from "./MewConnector";
import { BinanceSmartChainInjectedConnector } from "./BinanceConnector";
// import { createNetworkIdMapper } from '../../utils/networksConfig';
import { CoinbaseInjectedConnector } from "./CoinbaseConnector";

import { WalletPickerConfig } from "./index";

const bscNetworkToRenNetworkMapper = (id: number | string) => {
  let decodedId = id;
  if (typeof id === "string") {
    try {
      decodedId = parseInt(id);
    } catch (e) {
      decodedId = Buffer.from(id.split("0x").pop() || "", "hex")[0] as string | number;
    }
  }
  return (
    {
      97: RenNetwork.Testnet,
      56: RenNetwork.Mainnet,
    }[decodedId] || RenNetwork.Mainnet
  );
};

export const ethNetworkToRenNetwork = (id: string | number): RenNetwork => {
  return {
    "1": RenNetwork.Mainnet,
    "5": RenNetwork.Testnet,
  }[parseInt(id as string).toString() as "1" | "5"];
};

export const injected = new EthereumInjectedConnector({
  debug: false,
  networkIdMapper: ethNetworkToRenNetwork,
});

export const getMultiwalletConfig = (network: RenNetwork): WalletPickerConfig<unknown, string> => {
  return {
    chains: {
      [Chain.Ethereum]: [
        {
          name: Wallet.MetaMask,
          logo: "",
          connector: injected,
        },
        {
          name: Wallet.Coinbase,
          logo: "",
          connector: new CoinbaseInjectedConnector({
            debug: false,
            networkIdMapper: ethNetworkToRenNetwork,
          }),
        },
        {
          name: Wallet.MyEtherWallet,
          logo: "",
          connector: new EthereumMEWConnectConnector({
            debug: false,
            rpc: {
              5: `wss://goerli.infura.io/v3/ac9d2c8a561a47739b23c52e6e7ec93f`,
              1: `wss://mainnet.infura.io/ws/v3/${"62302e9d9b074d8baa2344a5550b6cc9"}`,
            },
            chainId: network === RenNetwork.Mainnet ? 1 : 42,
          }) as any,
        },
        {
          name: Wallet.WalletConnect,
          logo: "",
          connector: new EthereumWalletConnectConnector({
            rpc: {
              5: `https://goerli.infura.io/v3/ac9d2c8a561a47739b23c52e6e7ec93f`,
              1: `wss://mainnet.infura.io/ws/v3/${"62302e9d9b074d8baa2344a5550b6cc9"}`,
            },
            qrcode: true,
            debug: true,
          }),
        },
      ],
      // [Chain.BinanceSmartChain]: [
      //   {
      //     name: Wallet.BinanceSmartChain,
      //     logo: "",
      //     connector: new BinanceSmartChainInjectedConnector({ debug: true }),
      //   },

      //   {
      //     name: Wallet.MetaMask,
      //     logo: "",
      //     connector: (() => {
      //       const connector = new BinanceSmartChainInjectedConnector({
      //         debug: true,
      //         networkIdMapper: ethNetworkToRenNetwork,
      //       });
      //       connector.getProvider = () => (window as any).ethereum;
      //       return connector;
      //     })(),
      //   },
      // ],
      [Chain.Solana]: [
        {
          name: Wallet.Phantom,
          logo: "",
          connector: new SolanaConnector({
            debug: true,
            providerURL:
              (typeof window !== "undefined" && (window as any).solana) ||
              "https://www.phantom.app",
            clusterURL: network === RenNetwork.Mainnet ? "https://ren.rpcpool.com/" : undefined,
            network,
          }),
        },
        {
          name: Wallet.SolanaCoinbase,
          logo: "",
          connector: new SolanaConnector({
            debug: true,
            providerURL:
              "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
            clusterURL: network === RenNetwork.Mainnet ? "https://ren.rpcpool.com/" : undefined,
            network,
          }),
        },
        ...[
          {
            name: Wallet.Sollet,
            logo: "",
            connector: new SolanaConnector({
              providerURL: "https://www.sollet.io",
              clusterURL: network === RenNetwork.Mainnet ? "https://ren.rpcpool.com/" : undefined,
              network,
            }),
          },
        ],
      ],
    },
  };
};
