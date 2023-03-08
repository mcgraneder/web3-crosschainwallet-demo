import {
  AbstractEthereumConnector,
  SaneProvider,
  AbstractEthereumConnectorOptions,
} from "@renproject/multiwallet-abstract-ethereum-connector";
import { ConnectorInterface } from "@renproject/multiwallet-base-connector";
import { SyncOrPromise } from "@renproject/interfaces";

export class NoEthereumProviderError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "No Ethereum provider was found on window.ethereum.";
  }
}
export class UserRejectedRequestError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = "The user rejected the request.";
  }
}

export class RequestAlreadyPending extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message =
      "'wallet_requestPermissions' already pending for origin http://localhost:3001. Please wait.";
  }
}

export interface EthereumConnectorOptions extends AbstractEthereumConnectorOptions {
  debug: boolean;
}

// No good typings for injected providers exist.
export type InjectedProvider = SaneProvider & {
  isMetamask?: boolean;
  autoRefreshOnNetworkChange?: boolean;

  request: (request: { method: string }) => Promise<any>;
  enable: () => Promise<void>;
  on: (
    name: string,

    listener: (...args: any[]) => SyncOrPromise<void>
  ) => void;
};

const isResults = <T>(x: { results: T } | T): x is { results: T } =>
  (x as { results: T }).results !== undefined;

const resultOrRaw = <T>(x: { results: T } | T) => {
  if (isResults(x)) {
    return x.results;
  }
  return x;
};

export class EthereumInjectedConnector extends AbstractEthereumConnector<InjectedProvider> {
  supportsTestnet = true;
  constructor(options: EthereumConnectorOptions) {
    super(options);
  }
  handleUpdate = () => {
    this.getStatus()
      .then((...args) => {
        this.emitter.emitUpdate(...args);
      })
      .catch(async (...args) => this.deactivate(...args));
  };

  activate: ConnectorInterface<any, any>["activate"] = async () => {
    // Await in case a child class's getProvider is asynchronous.
    let provider = await (this as AbstractEthereumConnector<InjectedProvider>).getProvider();

    if (!provider) {
      throw Error("Missing Provider metamask first");
    }

    // clear all previous listeners
    await this.cleanup();

    if (provider.isMetamask) {
      // This behavior is being deprecated so don't rely on it
      provider.autoRefreshOnNetworkChange = false;
    }

    if ((provider as any).providers?.length) {
      provider =
        (provider as any).providers.find((p: any) => p.isMetaMask) ??
        (provider as any).providers[0];
    }

    let account;
    try {
      account = resultOrRaw(await provider.request({ method: "eth_requestAccounts" }))[0];
    } catch (error) {
      
      if ((error as any).code === 4001) {
        this.emitter.emitError(new Error("The user rejected request"));
        throw new UserRejectedRequestError();
      }
      if ((error as any).code === -32002) {
        this.emitter.emitError(
          new Error(
            "'wallet_requestPermissions' already pending for origin http://localhost:3001. Please wait."
          )
        );
        throw new RequestAlreadyPending();
      }
      console.error(error);
    }

    // if unsuccessful, try enable
    if (!account) {
      account = resultOrRaw((await provider.enable()) as any)[0];
    }
    provider.on("close", this.deactivate);
    provider.on("networkChanged", this.handleUpdate);
    provider.on("accountsChanged", this.handleUpdate);
    provider.on("chainChanged", this.handleUpdate);
    return this.getStatus();
  };

  getProvider = () => {
    //@ts-ignore
    return window.ethereum as InjectedProvider;
  };

  cleanup = async () => {
    // Await in case a child class's getProvider is asynchronous.
    const provider = await (this as AbstractEthereumConnector<InjectedProvider>).getProvider();
    if (provider.removeListener) {
     
      provider.removeListener("close", this.deactivate);
      provider.removeListener("networkChanged", this.handleUpdate);
      provider.removeListener("accountsChanged", this.handleUpdate);
      provider.removeListener("chainChanged", this.handleUpdate);
    }
  };

  deactivate = async (reason?: string) => {
    await this.cleanup();
    this.emitter.emitDeactivate(reason);
  };
}
