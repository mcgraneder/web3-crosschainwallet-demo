/* eslint-disable no-console */

import { EthAddress, EthProviderCompat } from "@renproject/chains-ethereum-old";
import { RenNetwork } from "@renproject/interfaces";
import { ConnectorEmitter, ConnectorInterface, ConnectorUpdate } from "./BaseConnctor";
import { ExternalProvider } from "@ethersproject/providers/lib/web3-provider";

const isResults = <T>(x: { results: T } | T): x is { results: T } =>
  (x as { results: T }).results !== undefined;

const resultOrRaw = <T>(x: { results: T } | T) => {
  if (isResults(x)) {
    return x.results;
  }
  return x;
};

export const ethNetworkToRenNetwork = (id: number | string): RenNetwork => {
  let decodedId = id;
  if (typeof id === "string") {
    try {
      decodedId = parseInt(id);
    } catch (e) {
      decodedId = Buffer.from(id.split("0x").pop() || "", "hex")[0] as string | number;
    }
  }
  const network = {
    1: RenNetwork.Mainnet,
    5: RenNetwork.Testnet,
  }[decodedId];
  if (!network) {
    throw new Error("Unknown Ethereum network");
  }
  return network;
};

export interface AbstractEthereumConnectorOptions {
  debug?: boolean;
  // Map chain ids to ren network versions
  networkIdMapper?: typeof ethNetworkToRenNetwork;
}

export type SaneProvider = (Exclude<EthProviderCompat, string> | ExternalProvider) & {
  removeListener?: (name: string, listener: unknown) => void;
  close?: () => Promise<void>;
};

export abstract class AbstractEthereumConnector<Provider extends SaneProvider = SaneProvider>
  implements ConnectorInterface<Provider, EthAddress>
{
  readonly debug?: boolean;
  supportsTestnet = true;
  networkIdMapper = ethNetworkToRenNetwork;
  emitter: ConnectorEmitter<Provider, EthAddress>;
  constructor({
    debug = false,
    networkIdMapper = ethNetworkToRenNetwork,
  }: AbstractEthereumConnectorOptions) {
    this.networkIdMapper = networkIdMapper;
    this.debug = debug;
    this.emitter = new ConnectorEmitter<Provider, EthAddress>(debug);
  }
  abstract activate: ConnectorInterface<Provider, EthAddress>["activate"];
  abstract getProvider: ConnectorInterface<Provider, EthAddress>["getProvider"];
  abstract deactivate: ConnectorInterface<Provider, EthAddress>["deactivate"];
  // Get the complete connector status in one call
  async getStatus(): Promise<ConnectorUpdate<Provider, EthAddress>> {
    if (this.debug) console.debug("getting status");
    return {
      account: await this.getAccount(),
      renNetwork: await this.getRenNetwork(),
      provider: await this.getProvider(),
    };
  }

  // Get default ethereum account
  async getAccount() {
    if (this.debug) console.debug("getting account");
    const account = resultOrRaw(
      await ((await this.getProvider()) as any).request({
        method: "eth_requestAccounts",
      })
    )[0];
    if (!account) {
      throw new Error("Not activated");
    }
    return account;
  }
  // Cast current ethereum network to Ren network version or throw
  async getRenNetwork() {
    if (this.debug) console.debug("getting chain");
    return this.networkIdMapper(
      await resultOrRaw((await this.getProvider()) as any).request({
        method: "eth_chainId",
      })
    );
  }
}
