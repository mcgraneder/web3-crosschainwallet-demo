import { RenNetwork } from "@renproject/utils";
import { useCallback, useEffect } from "react";
import { $network } from "../network/networkSlice";
import { $wallet } from "./walletSlice";
import { useMultiwallet } from "src/connectors/multiwallet";
import { Wallet } from "src/connectors/multiwallet/walletsConfig";
import { useSelector } from "react-redux";
import { Chain } from "@renproject/chains";
import { useChains } from "../network/networkHooks";

export enum WalletStatus {
  Disconnected = "disconnected",
  Connecting = "connecting",
  Connected = "connected",
  WrongNetwork = "wrong_network",
}

export type WalletData = ReturnType<typeof useMultiwallet> & {
  account: string;
  status: WalletStatus;
  connected: boolean;
  provider: any;
  wallet: Wallet;
  deactivateConnector: () => void;
  refreshConnector: () => void;
  chainId: string;
  error: Error;
  activateConnector: () => void
};

export const useSyncWalletNetwork = () => {
  const { chain } = useSelector($wallet);
  const { network } = useSelector($network);
  const { targetNetwork, setTargetNetwork } = useWallet(chain);
  useEffect(() => {
    if (network !== targetNetwork) {
      setTargetNetwork(
        network.includes("mainnet")
          ? RenNetwork.Mainnet
          : network.includes("testnet")
          ? RenNetwork.Testnet
          : network
      );
    }
  }, [network, setTargetNetwork, targetNetwork]);
};

type UseWallet = (chain: Chain) => WalletData;

export const useWallet: UseWallet = (chain) => {
  const { enabledChains, targetNetwork, activateConnector: ac, setTargetNetwork } = useMultiwallet();
  const { account = "", status = WalletStatus.Disconnected } = enabledChains?.[chain] || {};
  const provider = enabledChains?.[chain]?.provider;
  const chainId = enabledChains?.[chain]?.chain;
  const error = enabledChains?.[chain]?.error;

  // TODO: crit this is faulty FIX this
  const wallet = resolveWalletByProvider(provider);

  const deactivateConnector = useCallback(() => {
    enabledChains[chain]?.connector.deactivate();
  }, [enabledChains, chain]);

   const activateConnector = useCallback(() => {
     enabledChains[chain]?.connector.activate();
   }, [enabledChains, chain]);


  const refreshConnector = useCallback(() => {
    // deactivateConnector();
    // setTimeout(() => {
    //   enabledChains[chain]?.connector.activate();
    // }, 2000);
  }, [enabledChains, chain, deactivateConnector]);

  if (typeof window !== "undefined") (window as any).p = provider;
  return {
    account,
    status,
    connected: status === WalletStatus.Connected,
    provider,
    wallet,
    targetNetwork,
    enabledChains,
    activateConnector,
    setTargetNetwork,
    deactivateConnector,
    refreshConnector,
    chainId,
    error,
  } as WalletData;
};

const resolveWalletByProvider = (provider: any) => {
  let resolved = Wallet.MetaMask;

  // TODO: we should persist wallet selection somewhere
  if (!provider) {
    resolved = Wallet.MetaMask; //default wallet
  } else if (provider?.isMetaMask) {
    resolved = Wallet.MetaMask;
  } else if (provider?.isCoinbaseWallet) {
    resolved = Wallet.Coinbase;
  } else if (provider?.wallet?._providerUrl?.href?.includes("sollet")) {
    resolved = Wallet.Sollet;
  } else if (provider?.wallet) {
    resolved = Wallet.Phantom;
  } else if (provider?.chainId === "0x61" || provider?.chainId?.indexOf("Binance")) {
    resolved = Wallet.BinanceSmartChain;
  } else if (provider?.isMewConnect || provider?.isMEWConnect) {
    resolved = Wallet.MyEtherWallet;
  } else {
    console.warn("Unresolved wallet", provider);
  }
  return resolved;
};

export const SwitchNetwork = async (chain: Chain, network: RenNetwork) => {
  //@ts-ignore
  const { ethereum } = window;

  const chains = useChains(network);
  const chainInstance = chains[chain];
  // console.log("chainInstance", chainInstance, chains, chain)
  const networkData = (chainInstance.chain as any).network.config;
  console.log(networkData);
  if (networkData) {
    const { chainId, chainName, rpcUrls, blockExplorerUrls, nativeCurrency } = networkData;
    const params: any = [
      {
        chainId,
        chainName,
        rpcUrls,
        blockExplorerUrls,
        nativeCurrency,
      },
    ];

    try {
      await ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
      return { switched: true };
    } catch (error: any) {
      if (error.code === 4902) {
        // TODO: get new chain params
        try {
          await ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [],
          });
          return { switched: true };
        } catch (addError: any) {
          // handle "add" error
          return { switched: false, errorCode: addError.code };
        }
      } else if (error.code === 4001) {
        // user rejected the switch
      }
      return { switched: false, errorCode: error.code };
    }
  }
};
