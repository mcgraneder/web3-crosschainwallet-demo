/* eslint-disable no-console */

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ConnectorEvents, ConnectorInterface } from "@renproject/multiwallet-base-connector";
import { RenNetwork } from "@renproject/interfaces";
import { Toast } from "../../utils/toast";

export const trimAddress = (address?: string, chars = 4) => {
  if (!address) {
    return "";
  }
  if (address.length <= 2 * chars) {
    return address;
  }
  const start = address.slice(0, chars);
  const end = address.slice(-chars);
  return `${start}...${end}`;
};

interface MultiwalletConnector<P, A> {
  connector: ConnectorInterface<P, A>;
  provider?: P;
  account?: A;
  error?: Error;
  chain: string;
  status: "connecting" | "connected" | "disconnected" | "wrong_network" | "reconnecting" | "error";
  name: string;
  testvAL?: string;
}

export interface MultiwalletInterface<PossibleProviders, PossibleAccounts> {
  // A map of desired chains to their desired connectors
  enabledChains: {
    [key in string]: MultiwalletConnector<PossibleProviders, PossibleAccounts>;
  };
  targetNetwork: RenNetwork;
  setTargetNetwork: (n: RenNetwork) => void;
  activateConnector: <P, A>(
    chain: string,
    connector: ConnectorInterface<P, A>,
    name: string
  ) => void;
}

const context = createContext<MultiwalletInterface<any, any>>({
  enabledChains: {},
  targetNetwork: RenNetwork.Mainnet,
  setTargetNetwork: () => {
    /* */
  },
  activateConnector: () => {
    throw new Error("Multiwallet not ready");
  },
});

export const ConnectorWatcher = <P, A>({
  connector,
  chain,
  status,
  update,
  targetNetwork,
  name,
}: MultiwalletConnector<P, A> & {
  update: (update: MultiwalletConnector<P, A>) => void;
  targetNetwork: RenNetwork;
}): null => {
  const handleUpdate = useCallback(
    ({ provider, account, renNetwork }: any) => {
      update({
        name,
        connector,
        account,
        chain,
        provider,
        status: "connected", //renNetwork !== targetNetwork ? "wrong_network" : "connected",
      });
    },
    [update, chain, connector, targetNetwork]
  );

  const handleError = useCallback(
    (error: any) => {
      console.warn(error);
      update({
        name,
        connector,
        chain,
        error: undefined,
        provider: undefined,
        status: "error",
        testvAL: "fucked up error",
      });
      // connector.emitter.removeAllListeners();
    },
    [update, chain, connector]
  );

  const handleDeactivate = useCallback(
    (reason: string) => {
      console.debug(reason);
      update({
        name,
        connector,
        chain,
        provider: undefined,
        status: "disconnected",
        error: undefined,
      });
      // connector.emitter.removeAllListeners();
      Toast.success(`Disconnected`, `${name} has been disconnected from ${chain}`);
      // The conneector should clean up after itself internally
      // connector.emitter.removeAllListeners();
    },
    [update, chain, connector]
  );

  const activate = useCallback(() => {
    // re-activating should not be an issue, this saves us from
    // having to keep track of whether the connector is connected
    // in multiple places
    (async () => {
      const r = await connector.activate();
      setTimeout(async () => {
        update({
          name,
          connector,
          chain,
          account: r.account,
          provider: r.provider,
          status: "connected", //r.renNetwork !== targetNetwork ? "wrong_network" : "connected",
          testvAL: "firstActiv",
        });
      }, 500);
      {
        r.renNetwork === targetNetwork
          ? Toast.success(
              `Connected to ${chain}`,
              `Wallet: ${name}
          account: ${trimAddress(r.account as string, 4)}`
            )
          : Toast.error(
              `Unsupported Network`,
              `you are trying to connected to an  unsuported network.`
            );
      }
    })().catch((error) => {
      console.error(error);
      update({
        name,
        connector,
        chain,
        status: "disconnected",
        error,
      });
      Toast.error(`Connection failed`, `${error}`);
    });
  }, [connector, update, chain, targetNetwork]);

  // Register listeners
  useEffect(() => {
    // remove any hanging listeners in case of a re-connect
    // FIXME: I think this is uneccessary, and may cause events to be lost
    //        so lets keep the listeners around and rely on the emitter
    //        to clean up after itself
    // connector.emitter.removeAllListeners();

    // Immediately add listeners because they may fire before
    // or during activation
    connector.emitter.addListener(ConnectorEvents.UPDATE, handleUpdate);
    connector.emitter.addListener(ConnectorEvents.ERROR, handleError);
    connector.emitter.addListener(ConnectorEvents.DEACTIVATE, handleDeactivate);

    return () => {
      connector.emitter.removeAllListeners();
    };
  }, [connector, handleDeactivate, handleError, handleUpdate]);

  const [previousNetwork, setPreviousNetwork] = useState("");
  // Always re-activate if targetNetwork has changed
  useEffect(() => {
    if (previousNetwork != targetNetwork) {
      setPreviousNetwork(targetNetwork);
      activate();
    }
  }, [activate, targetNetwork, previousNetwork]);

  // Re-activate if reconnecting
  useEffect(() => {
    if (status === "reconnecting") {
      update({
        name,
        connector,
        chain,
        status: "connecting",
      });
      activate();
    }
  }, [status]);

  return null;
};

export const MultiwalletProvider = <P, A>({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element => {
  const Provider = context.Provider;
  const [targetNetwork, setTargetNetwork] = useState(RenNetwork.Testnet);
  const [enabledChains, setEnabledChains] = useState<MultiwalletInterface<P, A>["enabledChains"]>(
    {}
  );
  const updateConnector = useCallback(
    (update: MultiwalletConnector<P, A>) => {
      setEnabledChains((c) => ({
        ...c,
        [update.chain]: update,
      }));
    },
    [setEnabledChains]
  );

  const activateConnector = useCallback(
    async (chain: string, connector: any, name: string) => {
      // catch insecure connector modification
      if (enabledChains.hasOwnProperty(chain)) {
        const oldConnector = enabledChains[chain]!;
        // Don't re-connect if the same connector is already connecting or connected
        if (
          oldConnector.name === name &&
          !["disconnected", "wrong_network"].includes(oldConnector?.status)
        ) {
          return;
        }

        // Deactivate the current connector
        if (oldConnector.status !== "disconnected") {
          try {
            await oldConnector.connector.deactivate();
          } catch (e) {
            console.warn("failed to deactivate old connector", e);
          }
        }
        delete enabledChains[chain];
        updateConnector({ connector, chain, name, status: "reconnecting" });
      } else {
        updateConnector({ connector, chain, name, status: "connecting" });
      }
    },
    [enabledChains, setEnabledChains, updateConnector]
  );

  return (
    <>
      {Object.entries(enabledChains).map(([chain, x]) => (
        <ConnectorWatcher
          key={chain}
          {...x}
          update={updateConnector}
          targetNetwork={targetNetwork}
        />
      ))}
      <Provider
        value={{
          enabledChains,
          activateConnector,
          targetNetwork,
          setTargetNetwork,
        }}>
        {children}
      </Provider>
    </>
  );
};

export const useMultiwallet = <P, A>(): MultiwalletInterface<P, A> => {
  return useContext(context as React.Context<MultiwalletInterface<P, A>>);
};
