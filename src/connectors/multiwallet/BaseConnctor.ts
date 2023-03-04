import { RenNetwork, SyncOrPromise } from "@renproject/interfaces";
import { EventEmitter } from "events";

export interface ConnectorUpdate<ChainProvider, ChainAccount> {
  provider: ChainProvider;
  renNetwork: RenNetwork;
  account?: ChainAccount;
}

export interface ConnectorInterface<ChainProvider, ChainAccount> {
  supportsTestnet: boolean;
  activate: () => SyncOrPromise<ConnectorUpdate<ChainProvider, ChainAccount>>;

  getProvider: () => SyncOrPromise<ChainProvider>;
  getAccount: () => SyncOrPromise<ChainAccount>;
  getRenNetwork: () => SyncOrPromise<RenNetwork>;
  deactivate: (reason?: string) => SyncOrPromise<void>;
  emitter: ConnectorEmitter<ChainProvider, ChainAccount>;
}

export enum ConnectorEvents {
  UPDATE = "CONNECTOR_UPDATE",
  ERROR = "CONNECTOR_ERROR",
  DEACTIVATE = "CONNECTOR_DEACTIVATE",
}

export class ConnectorEmitter<CP, CA> extends EventEmitter {
  constructor(readonly debug: boolean) {
    super();
  }
  emitUpdate(update: ConnectorUpdate<CP, CA>): void {
    if (this.debug) {
      console.debug(`'${ConnectorEvents.UPDATE}'`, update);
    }
    this.emit(ConnectorEvents.UPDATE, update);
  }

  emitError(error: Error): void {
    if (this.debug) {
      console.debug(`'${ConnectorEvents.ERROR}'`, error);
    }
    this.emit(ConnectorEvents.ERROR, error);
  }

  emitDeactivate(reason?: string): void {
    if (this.debug) {
      console.debug(`'${ConnectorEvents.DEACTIVATE}'`);
    }
    this.emit(ConnectorEvents.DEACTIVATE, reason);
  }
}
