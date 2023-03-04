import { RenNetwork } from "@renproject/interfaces";
import { ConnectorInterface } from "./BaseConnctor";
import React, { HTMLAttributes, useCallback, useEffect } from "react";

export * from "./MultiwalletProvider";

export interface ConnectorConfig<P, A> {
  /**
   * Name of the wallet
   */
  name: string;
  /**
   * URL for logo to be shown (might change in future to a component)
   */
  logo: string;
  /**
   * The Multiwallet Connector to be used for this wallet
   */
  connector: ConnectorInterface<P, A>;
  /**
   * A component to be shown before a wallet is activated, for extra context / warnings
   */
  info?: React.FC<{
    name: string;
    acknowledge: () => void;
    onClose: () => void;
    onPrev: () => void;
  }>;
}

export interface WalletPickerConfig<P, A> {
  chains: { [key in string]: Array<ConnectorConfig<P, A>> };
  debug?: boolean;
}

export interface WalletPickerProps<P, A> extends HTMLAttributes<HTMLDivElement> {
  /**
   * Which chain to show wallets for
   */
  chain: string;
  /**
       Function used to close/cancel the connection request
     */
  onClose: () => void;
  /**
   * Configuration for connectors across all chains
   */
  config: WalletPickerConfig<P, A>;
  /**
       Whether a wallet is in the process of connecting
     */
  connecting?: boolean;
  /**
       Whether a wallet is connected to the wrong chain
     */
  wrongNetwork?: boolean;
  /**
       Network the wallet should connect to
     */
  targetNetwork: RenNetwork | "mainnet" | "testnet";
  /**
       MaterialUI class overrides for the component shown when connecting
     */
  connectingClasses?: any;
  /**
       MaterialUI class overrides for the wallet selection components
     */
  walletClasses?: WalletEntryProps<P, A>["classes"];
  /**
       MaterialUI class overrides for the picker container
     */
  pickerClasses?: any;
  /**
       An optional component to show before wallets are presented
     */
  DefaultInfo?: React.FC<{
    name: string;
    acknowledge: () => void;
    onClose: () => void;
  }>;
  /**
       An optional replacement to show when a wallet is connecting
     */
  ConnectingInfo?: React.FC<{
    chain: string;
    name: string;
    onClose: () => void;
  }>;
  /**
       An optional replacement to show when a wallet is connected to the wong network
     */
  WrongNetworkInfo?: React.FC<{
    chain: string;
    targetNetwork: string;
    onClose: () => void;
  }>;

  /**
       An optional replacement for the button shown for each wallet option
     */
  WalletEntryButton?: React.FC<{
    chain: string;
    onClick: () => void;
    name: string;
    logo: string;
  }>;
  /**
     An optional replacement for the label, which groups wallet options by chains
     */
  WalletChainLabel?: React.FC<{
    chain: string;
  }>;
}

/**
 * A WalletPicker component, intended to be launched in a modal.
 * Will present the user with a list of wallets for the selected chain
 * If DefaultInfo is provided, if will be displayed before the list is shown
 * If a selected wallet has an info component, that will be displayed
 * after the wallet is selected, and will only proceed to enable the wallet
 * after the user has acknowledged the prompt.
 * The component will show a loading state while the wallet is being enabled
 */

interface WalletEntryProps<P, A> extends ConnectorConfig<P, A> {
  chain: string;
  classes?: any;
  onPrev: () => void;
  setInfo: (i: any) => void;
  setName: (i: string) => void;
  WalletEntryButton?: WalletPickerProps<P, A>["WalletEntryButton"];
}
