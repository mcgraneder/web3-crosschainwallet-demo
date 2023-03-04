import React, { useEffect, useCallback } from "react";
import Modal from "../modals/Modal";
import Card from "../catalog/Card";
import ContentWrapper from "./ContentWrapper";
import PrimaryButton from "../catalog/PrimaryButton";
import { RenNetwork } from "@renproject/interfaces";
import { ConnectorConfig } from "src/connectors/multiwallet";
import { HTMLAttributes } from "react";
import { useMultiwallet } from "src/connectors/multiwallet";
import { Tab } from "@headlessui/react";
import { useSessionStorage } from "src/hooks/useSessionStorage";
import { getMultiwalletConfig } from "src/connectors/multiwallet/multiwalletConfig";
import { Chain } from "@renproject/chains";
import ConnectingModal from "./ConnectingModal";
import UnsupportedNetworkModal from "./UnsupportedNetworkModal";
import ExitIcon from "../../../public/svgs/exitIcon.svg";
import { Wallet, getWalletConfig } from "src/connectors/multiwallet/walletsConfig";
import { UserRejectedRequestError } from "src/connectors/multiwallet/EthereumConnector";
import { RequestAlreadyPending } from "src/connectors/multiwallet/EthereumConnector";
import { Transaction, PublicKey } from "@solana/web3.js";
import EventEmitter from "eventemitter3";
import ConnectionErrorModal from "./ConnectionErrorModal";
import { Toast } from "../../utils/toast";
import EthereumLog from "../../../public/svgs/Eth.svg";
import SolanaLogo from "../../../public/svgs/Solana.svg";

export interface WalletAdapter extends EventEmitter {
  publicKey: PublicKey | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  connect: () => any;
  disconnect: () => any;
}

export interface WalletPickerConfig<P, A> {
  chains: { [key in string]: Array<ConnectorConfig<P, A>> };
  debug?: boolean;
}

export interface WalletPickerProps<P, A> extends HTMLAttributes<HTMLDivElement> {
  chain: string;
  Icon?: any;
  onClose: () => void;
  config: WalletPickerConfig<P, A>;
  connecting?: boolean;
  connected?: boolean | undefined;
  wrongNetwork?: boolean;
  targetNetwork: any;
  DefaultInfo?: React.FC<{
    name: string;
    acknowledge: () => void;
    onClose: () => void;
  }>;
  ConnectingInfo?: React.FC<{
    chain: string;
    name: string;
    onClose: () => void;
  }>;
  WrongNetworkInfo?: React.FC<{
    chain: string;
    targetNetwork: string;
    onClose: () => void;
  }>;
  WalletEntryButton?: React.FC<{
    chain: string;
    onClick: () => void;
    name: string;
    logo: string;
  }>;
  WalletChainLabel?: React.FC<{
    chain: string;
  }>;
}

interface WalletEntryProps<P, A> extends ConnectorConfig<P, A> {
  chain: string;
  classes?: any;
  onClose: () => void;
  WalletEntryButton?: WalletPickerProps<P, A>["WalletEntryButton"];
  connected: boolean | undefined;
  Icon: any;
}

const WalletEntry = <P, A>({
  name,
  chain,
  connector,
  info: Info,
  connected,
}: WalletEntryProps<P, A>): JSX.Element => {
  const providerEthereum = localStorage.getItem("providerEthereum");
  const providerSolana = localStorage.getItem("providerSolana");

  const { activateConnector, enabledChains } = useMultiwallet<P, A>();

  const onClick = useCallback(() => {
    if (chain === Chain.Solana && enabledChains[Chain.Ethereum]?.status !== "connected") {
      Toast.error("Must connect to Ethereum first");
      return;
    }
    activateConnector(chain, connector, name);
    chain === Chain.Ethereum
      ? localStorage.setItem("providerEthereum", name)
      : localStorage.setItem("providerSolana", name);
  }, [activateConnector, Info, chain, connector]);

  const walletConfig = getWalletConfig(name as Wallet);
  const { Icon } = walletConfig;
  return (
    <div
      onClick={onClick}
      className='flex items-center justify-between px-4 py-3 mx-2 mb-2 ml-1 mr-1 sm:flex-row rounded-xl bg-black-800 hover:cursor-pointer hover:bg-black-700'>
      <div className='flex items-center self-start sm:self-auto'>
        <div className='flex items-center justify-center p-2 mr-4 rounded-full pointer-events-none select-none bg-black-900'>
          <Icon width={"40px"} />
        </div>
        <div className='float-right text-lg font-semibold tracking-wide has-tooltip sm:self-auto '>
          <p>{name}</p>
        </div>
      </div>
      {chain === Chain.Ethereum
        ? connected &&
          providerEthereum === name && (
            <span className=''>
              <div className='w-4 h-4 rounded-full bg-primary'></div>
            </span>
          )
        : connected &&
          providerSolana === name && (
            <span className=''>
              <div className='w-4 h-4 rounded-full bg-primary'></div>
            </span>
          )}
    </div>
  );
};

const StyledTab = ({ title }: { title: React.ReactNode }) => {
  return (
    <Tab
      className={({ selected }: { selected: boolean }) =>
        `  rounded-[14px] py-3 px-20 flex justify-center sm:px-20 md:px-20 lg:px-20  font-semibold ${
          selected && "bg-black-800"
        }`
      }>
      {({ selected }: { selected: boolean }) => (
        <div className={`${selected && "text-primary"} justify-self-center flex items-center `}>
          {title}
        </div>
      )}
    </Tab>
  );
};

export interface WalletPickerModalProps<P, A> {
  options: WalletPickerProps<P, A>;
  network: RenNetwork;
  setChain: (chain: any) => void;
  toggleWalletModal: () => void;
  open?: boolean;
  wallet: Wallet;
  error: Error;
}

export const WalletConnectModal = <P, A>({
  options,
  network,
  setChain,
  toggleWalletModal,
  wallet,
  error,
}: WalletPickerModalProps<P, A>): JSX.Element => {
  const { enabledChains, targetNetwork, setTargetNetwork } = useMultiwallet<P, A>();

  const { Icon } = getWalletConfig(wallet as Wallet);
  const connecting = enabledChains[options.chain]?.status === "connecting";
  const connected = enabledChains[options.chain]?.status === "connected";
  const wrongNetwork = enabledChains[options.chain]?.status === "wrong_network";
  const status = enabledChains[options.chain]?.status;

  const deactivateConnector = useCallback(() => {
    if (options.chain === Chain.Ethereum) {
      for (const chain of Object.keys(enabledChains)) {
        enabledChains[chain]?.connector.deactivate();
      }
    } else enabledChains[options.chain]?.connector.deactivate();
  }, [enabledChains, options.chain]);

  useEffect(() => {
    if (connected) {
      options.onClose();
    }
  }, [connected, options]);

  useEffect(() => {
    if (options.targetNetwork !== targetNetwork) {
      console.log(options.targetNetwork, targetNetwork);
      switch (options.targetNetwork) {
        case "testnet":
          setTargetNetwork(RenNetwork.Testnet);
          break;
        case "mainnet":
          setTargetNetwork(RenNetwork.Mainnet);
          break;
        default:
          setTargetNetwork(options.targetNetwork);
      }
    }
  }, [options.targetNetwork, targetNetwork, setTargetNetwork]);

  const showErrorModal =
    (error && error instanceof UserRejectedRequestError) ||
    (error && error instanceof RequestAlreadyPending);

  const cancel = useCallback(async () => {
    if (connecting || showErrorModal) {
      try {
        await enabledChains[options.chain]?.connector.deactivate();

        options.chain === Chain.Ethereum
          ? localStorage.removeItem("providerEthereum")
          : localStorage.removeItem("providerSolana");
      } catch (err) {
        console.error(err);
      }
    }
    options.onClose();
  }, [connecting, wrongNetwork, enabledChains, options, showErrorModal]);
  // List of tabs along with icons
  const tabs = Object.keys(getMultiwalletConfig(network as any).chains);

  const _onTabChange = (index: number) => {
    setTabIndex(index);
  };

  const [tabIndex, setTabIndex] = useSessionStorage("txTabIndex", 0);
  const rightLabelDisplay = connected ? `connected` : "";

  const connectors = options.config.chains[options.chain];

  return (
    <>
      {(showErrorModal && status === "disconnected" && (
        <>
          <ConnectionErrorModal close={cancel} />
        </>
      )) ||
        (connecting && (
          <>
            <ConnectingModal close={cancel} open={!connected} />
          </>
        )) ||
        (wrongNetwork && (
          <UnsupportedNetworkModal
            close={toggleWalletModal}
            chain={options.chain as Chain}
            targetNetwork={network as any}
          />
        )) || (
          <Modal open onClose={toggleWalletModal}>
            <div>
              <Card
                responsiveOverride='bg-black-800 w-[470px]'
                onExitIconClick={toggleWalletModal}
                ExitIcon={ExitIcon}>
                <Card.Title>
                  <div className='flex gap-4 items-center'>
                    <div>{`Connect to ${options.chain}`}</div>
                    <div>
                      {tabIndex == 0 ? (
                        <EthereumLog width={32} height={32} />
                      ) : (
                        <SolanaLogo width={32} height={32} />
                      )}
                    </div>
                  </div>
                </Card.Title>
                {/* <Card.Description>{"Connect to Catalog"}</Card.Description> */}
                <hr className='my-1 sm:my-1 border-black-800' />
                <div className='w-full mb-6 text-black-600'>
                  <div className='text-base text-grey-500'>
                    {
                      "Connect your wallet to any of the chains Catalog supports below. You can connect to multiple chains at once."
                    }
                  </div>
                </div>
                {
                  <div className=' bg-black-800 rounded-32px'>
                    <Tab.Group defaultIndex={tabIndex} onChange={_onTabChange}>
                      <Tab.List
                        className={`bg-black-900  flex sm:flex-row flex-col  items-center justify-between rounded-[22px] p-2`}>
                        {tabs.map((tab) => {
                          return (
                            <div key={tab} onClick={() => setChain(tab as Chain)}>
                              <StyledTab title={tab} />
                            </div>
                          );
                        })}
                      </Tab.List>
                      <Tab.Panels className={`mt-6 px-2 `}></Tab.Panels>
                    </Tab.Group>
                  </div>
                }
                <ContentWrapper
                  overrideSmallScreenStyle
                  label={"Available Wallets"}
                  rightLabel={rightLabelDisplay}
                  rightLabelClassName='text-primary'>
                  <div className='flex flex-col gap-1'>
                    {connectors.map((x) => {
                      return (
                        <div key={x.name}>
                          <WalletEntry
                            key={x.name}
                            {...x}
                            onClose={options.onClose}
                            chain={options.chain}
                            connected={connected}
                            Icon={Icon}
                          />
                        </div>
                      );
                    })}
                  </div>
                </ContentWrapper>
                <div className='flex items-center justify-center mt-6'>
                  {connected && (
                    <PrimaryButton onClick={deactivateConnector} className='bg-[#1F3F38] px-12'>
                      {"disconnect"}
                    </PrimaryButton>
                  )}
                </div>
              </Card>
            </div>
          </Modal>
        )}
    </>
  );
};

export default React.memo(WalletConnectModal);
