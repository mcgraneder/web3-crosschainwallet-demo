// TODO: move to multiwallet
import BinanceChainWallet from "../../../public/svgs/wallets/BinanceChainWallet.svg";
import CoinbaseWallet from "../../../public/svgs/wallets/CoinbaseWallet.svg";
import MetaMaskWallet from "../../../public/svgs/wallets/MetaMaskWallet.svg";
import MyEtherWallet from "../../../public/svgs/wallets/MyEtherWallet.svg";
import PhantomWallet from "../../../public/svgs/wallets/PhantomWallet.svg";
import SolletWallet from "../../../public/svgs/wallets/SolletWallet.svg";

export enum Wallet {
  MetaMask = "MetaMask",
  WalletConnect = "WalletConnect",
  MyEtherWallet = "MyEtherWallet",
  Coinbase = "Coinbase",
  BinanceSmartChain = "BinanceSmartChain",
  Sollet = "Sollet",
  Phantom = "Phantom",
  SolanaCoinbase = "SolanaCoinbase",
}

export type WalletIconsConfig = {
  Icon: any;
};

export type WalletLabelsConfig = {
  fullName: string;
  shortName?: string;
};

type WalletBaseConfig = WalletIconsConfig & WalletLabelsConfig & {};

export const unsetWalletConfig: WalletBaseConfig = {
  Icon: CoinbaseWallet,
  fullName: "Unset full name",
};

const walletsBaseConfig: Record<Wallet, WalletBaseConfig> = {
  [Wallet.BinanceSmartChain]: {
    fullName: "Binance Wallet",
    shortName: "Binance Wallet",
    Icon: BinanceChainWallet,
  },
  [Wallet.MetaMask]: {
    fullName: "MetaMask Wallet",
    shortName: "MetaMask",
    Icon: MetaMaskWallet,
  },
  [Wallet.MyEtherWallet]: {
    fullName: "MyEther Wallet",
    shortName: "MEW",
    Icon: MyEtherWallet,
  },
  [Wallet.Phantom]: {
    fullName: "Phantom Wallet",
    shortName: "Phantom",
    Icon: PhantomWallet,
  },
  [Wallet.Sollet]: {
    fullName: "Sollet.io Wallet",
    shortName: "Sollet.io",
    Icon: SolletWallet,
  },
  [Wallet.WalletConnect]: {
    fullName: "WalletConnect",
    shortName: "WalletConnect",
    Icon: CoinbaseWallet,
  },
  [Wallet.Coinbase]: {
    fullName: "Coinbase Wallet",
    shortName: "Coinbase",
    Icon: CoinbaseWallet,
  },
  [Wallet.SolanaCoinbase]: {
    fullName: "Solana Coinbase Wallet",
    shortName: "Solana Coinbase",
    Icon: CoinbaseWallet,
  },
};

export const walletsConfig = walletsBaseConfig;

export const getWalletConfig = (wallet: Wallet) => {
  const config = walletsConfig[wallet];
  if (!config) {
    throw new Error(`Wallet config not found for ${wallet}`);
  }
  return config;
};
