import { RenNetwork } from "@renproject/interfaces";
import { AbstractEthereumConnectorOptions } from "./AbstractConnector";
import { EthereumInjectedConnector, InjectedProvider } from "./EthereumConnector";

export interface BinanceSmartChainConnectorOptions extends AbstractEthereumConnectorOptions {
  debug: boolean;
}

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

// export class BinanceSmartChainInjectedConnector extends EthereumInjectedConnector {
//     supportsTestnet = true;
//     constructor(options: BinanceSmartChainConnectorOptions) {
//         super({
//             networkIdMapper: bscNetworkToRenNetworkMapper,
//             ...options,
//         });
//     }

//     getProvider = () => {
//         //@ts-ignore
//         return window.BinanceChain as InjectedProvider;
//     };
// }

export class BinanceSmartChainInjectedConnector extends EthereumInjectedConnector {
  constructor(options: BinanceSmartChainConnectorOptions) {
    super({
      networkIdMapper: bscNetworkToRenNetworkMapper,
      ...options,
    });
    this.supportsTestnet = true;
    this.getProvider = () => {
      //@ts-ignore
      return window.BinanceChain as InjectedProvider;
    };
  }
}
