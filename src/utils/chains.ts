import { Chain } from "@renproject/chains";
import { Bitcoin, BitcoinBaseChain } from "@renproject/chains-bitcoin";
import {
  BinanceSmartChain,
  Ethereum,
  EthProvider,
  EVMNetworkConfig as EvmNetworkConfig,
} from "@renproject/chains-ethereum";
import Wallet from "src/connectors/multiwallet/Wallet";
import { Solana } from "@renproject/chains-solana";
import { Chain as GatewayChain, DepositChain, RenNetwork } from "@renproject/utils";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { providers } from "ethers";
import { EthereumBaseChain } from "@renproject/chains-ethereum";

export interface ChainInstance<C = GatewayChain> {
  chain: C;
  connectionRequired?: boolean;
  accounts?: string[];
}

export type ChainInstanceMap = Record<Chain, ChainInstance>;
export type PartialChainInstanceMap = Partial<ChainInstanceMap>;

interface EVMConstructor<EVM> {
  configMap: {
    [network in RenNetwork]?: EvmNetworkConfig;
  };

  new ({ network, provider }: { network: RenNetwork; provider: EthProvider }): EVM;
}

export const getEthereumBaseChain = <EVM extends EthereumBaseChain>(
  ChainClass: EVMConstructor<EVM>,
  network: RenNetwork
): ChainInstance & {
  chain: EVM;
} => {
  const config = ChainClass.configMap[network];
  if (!config) {
    throw new Error(`No configuration for ${ChainClass.name} on ${network}.`);
  }

  let rpcUrl = config.config.rpcUrls[0]
  const provider = new providers.JsonRpcProvider(rpcUrl);

  return {
    chain: new ChainClass({
      network,
      provider,
    }),
    connectionRequired: true,
    accounts: [],
  };
};

export const getSolanaChain = (
  network: RenNetwork
): ChainInstance & {
  chain: Solana;
} => {
  const solanaNetwork = network === RenNetwork.Mainnet ? "mainnet-beta" : "testnet";
  const rpcUrl = clusterApiUrl(solanaNetwork);
  const provider = new Connection(rpcUrl);
  console.log(rpcUrl);
  const signer = ((window as any).solana as any) || new Wallet(rpcUrl, network);
  console.log("solana signer", (window as any).solana, signer);
  console.log(signer);
  return {
    chain: new Solana({
      network,
      provider,
      signer,
    }) as any,
    connectionRequired: true,
    accounts: [],
  };
};

const getBitcoinBaseChain = <BTC extends BitcoinBaseChain>(ChainClass: BTC) => {
  return {
    chain: ChainClass,
  };
};

const getEVMDefaultProvider = (
  ChainClass: EVMConstructor<any>,
  network: RenNetwork,
  configMap = ChainClass.configMap
) => {
  const config = configMap[network];
  if (!config) {
    throw new Error(`No configuration for ${ChainClass.name} on ${network}.`);
  }

  let rpcUrl = config.config.rpcUrls[0];
  // if (env.INFURA_ID) {
  //   for (const url of config.config.rpcUrls) {
  //     if (url.match(/^https:\/\/.*\$\{INFURA_API_KEY\}/)) {
  //       rpcUrl = url.replace(/\$\{INFURA_API_KEY\}/, env.INFURA_ID);
  //       break;
  //     }
  //   }
  // }

  let provider = new providers.JsonRpcProvider(rpcUrl);

  return provider;
};

export const getEthereumChain = (
  network: RenNetwork
): ChainInstance & {
  chain: Ethereum;
} => {
  const provider = getEVMDefaultProvider(Ethereum as unknown as any, network);
  const signer = provider.getSigner("0x13480Ea818fE2F27b82DfE7DCAc3Fd3E63A94113");
  return {
    chain: new Ethereum({
      network,
      provider,
      // @ts-ignore
      signer: signer,
      defaultTestnet: "goerli",
    }),
    connectionRequired: true,
    accounts: [],
  };
};

export const getDefaultChains = (network: RenNetwork): ChainInstanceMap => {
  const ethereumBaseChains = {
    [Chain.Ethereum]: getEthereumChain(network),
    [Chain.BinanceSmartChain]: getEthereumBaseChain(BinanceSmartChain, network),
    // [Chain.Polygon]: getEthereumBaseChain(Polygon, network),
    // // [Chain.Goerli]: getEthereumBaseChain(Goerli, network),
    // [Chain.Avalanche]: getEthereumBaseChain(Avalanche, network),
    // [Chain.Arbitrum]: getEthereumBaseChain(Fantom, network),
    // [Chain.Fantom]: getEthereumBaseChain(Arbitrum, network),
  };

  const bitcoinBaseChains = {
    [Chain.Bitcoin]: getBitcoinBaseChain(new Bitcoin({ network })),
  };

  const solanaBaseChains = {
    [Chain.Solana]: getSolanaChain(network),
  }; //getSolanaChain(network)

  return {
    ...ethereumBaseChains,
    ...bitcoinBaseChains,
    ...solanaBaseChains,
  } as unknown as ChainInstanceMap;
};

export const pickChains = (chains: ChainInstanceMap, from: Chain, to: Chain) => {
  const pickedChains = { [from]: chains[from], [to]: chains[to] };
  (window as any).pickedChains = pickedChains;
  console.log("chains picked", pickedChains);
  return pickedChains;
};
