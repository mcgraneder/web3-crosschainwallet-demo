import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import NavigationBar from "./NavigationBar";
import WalletConnectionModal from "src/components/WalletModal/WalletConnectionModal";
import ConnectAgainModal from "src/components/modals/ConnectAgainModal";
import { useDispatch, useSelector } from "react-redux";
import { useMultiwallet } from "src/connectors/multiwallet";
import { $network } from "src/features/network/networkSlice";
import { $wallet, setChain, setPickerOpened } from "src/features/wallet/walletSlice";
import { useSyncWalletNetwork, useWallet } from "src/features/wallet/walletHooks";
import { getMultiwalletConfig } from "../../connectors/multiwallet/multiwalletConfig";
import { Chain } from "@renproject/chains";
import { WalletPickerProps } from "src/components/WalletModal/WalletConnectionModal";
import SlideOver from "../../components/Sidebar/SlideOver";
import ConnectModal from "../../components/modals/Connect";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const dispatch = useDispatch();
  useSyncWalletNetwork();
  const { activateConnector } = useMultiwallet();
  const { network } = useSelector($network);
  const { chain } = useSelector($wallet);
  const multiwallet = useWallet(Chain.Ethereum);
  // console.log(network, chain)

  const {
    status,
    account,
    connected,
    deactivateConnector,
    refreshConnector,
    wallet,
    provider,
    error,
  } = multiwallet;

  useEffect(() => {
    console.log(error);
    console.log(chain);
  }, [error, chain]);

  const showConnectModal = connected 

  const [walletMenuAnchor, setWalletMenuAnchor] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal);

  // useEffect(() => {
  //   const activeEthereumWallets = getMultiwalletConfig(network).chains[Chain.Ethereum]
  //   const activeSolanaWallets = getMultiwalletConfig(network).chains[Chain.Solana]

  //   activeEthereumWallets.forEach((wallet, index = 0) => {
  //     if (localStorage.getItem("providerEthereum") === wallet.name) {
  //       activateConnector(
  //         chain,
  //         getMultiwalletConfig(network).chains[chain][index].connector,
  //         wallet.name
  //       )
  //       index ++
  //     }
  //   })
  //   //create seperate providers
  //   activeSolanaWallets.forEach((wallet, index = 0) => {
  //     if (localStorage.getItem("providerSolana") === wallet.name) {
  //       activateConnector(
  //         chain,
  //         getMultiwalletConfig(network).chains[chain][index].connector,
  //         wallet.name
  //       )
  //       index ++
  //     }
  //   })
  // }, []);

  // useEffect(() => {
  //   console.log(account)
  // }), [connected]

  const handleWalletPickerClose = useCallback(() => {
    dispatch(setPickerOpened(false));
  }, [dispatch]);
  const handleWalletMenuClose = useCallback(() => {
    setWalletMenuAnchor(null);
  }, []);

  const handleWalletButtonClick = useCallback(
    (chain: any) => {
      if (connected) {
        dispatch(setPickerOpened(true));
        dispatch(setChain(chain));
        return;
      } else {
        dispatch(setPickerOpened(true));
        dispatch(setChain(chain));
      }
    },
    [dispatch, connected]
  );

  const walletPickerOptions = useMemo(() => {
    const options: WalletPickerProps<any, any> = {
      targetNetwork: network,
      chain,
      onClose: handleWalletPickerClose,
      config: getMultiwalletConfig(network),
      connecting: true,
    };
    return options;
  }, [handleWalletPickerClose, network, chain]);

  useEffect(() => {
    console.log(openWalletModal);
  }, [openWalletModal]);

  return (
    <>
      <SlideOver
        open={open}
        setOpen={setOpen}
        toggleWalletModal={toggleWalletModal}
        disconnect={deactivateConnector}
      />
      {/* {installMetamask && <InstallMetaMask close={setInstallMetamask} />} */}
      {openWalletModal && (
        <WalletConnectionModal
          error={error}
          wallet={wallet}
          open={false}
          options={walletPickerOptions}
          network={network}
          setChain={handleWalletButtonClick}
          toggleWalletModal={toggleWalletModal}
        />
      )}
      {showConnectModal && (
        <ConnectModal goBack={toggleWalletModal} isWalletModalOpen={openWalletModal} />
      )}
      {/* {error && (
        <ConnectionErrorModal
          pendingWallet={pendingWallet}
          close={toggleErrorModal}
          toggleWalletModal={toggleWalletModal}
          setConnecting={setConnecting}
          connectOn={connectOn}
          error={error}
          loginFromUnsupportedChain={loginFromUnsupportedChain}
        />
      )}
      {showAccount && (
        <ConnectedAccountModal
          open={showAccount}
          close={toggleShowAccount}
          openWallet={toggleWalletModal}
        />
      )}
      {!error && connecting && (
        <ConnectingModal open={!error && connecting} close={toggleConecting} />
      )}
      {openWalletModal && (
        <WalletConnectModal
          setPendingWallet={setPendingWallet}
          toggleWalletModal={toggleWalletModal}
          setConnecting={setConnecting}
          connectOn={connectOPmodaln}
          disconnect={disconnect}
          open={openWalletModal}
          loginFromUnsupportedChain={loginFromUnsupportedChain}
        />
      )} */}
      <div className='flex flex-col items-center h-screen text-white md:px-8 lg:h-auto lg:min-h-screen bg-black-800'>
        <NavigationBar
          toggleWalletModal={toggleWalletModal}
          setShowAccount={setOpen}
          disconnect={deactivateConnector}
          multiwallet={multiwallet}
        />
        <div
          id='layout'
          className='relative bg-black-900 p-2 overflow-y-scroll coingrid-scrollbar lg:overflow-y-auto md:p-10 rounded-t-[40px] md:rounded-[40px] overflow-x-hidden  flex flex-col  items-center flex-1 w-full lg:mb-6'>
          {children}
        </div>

      </div>
    </>
  );
}

export default DefaultLayout;
